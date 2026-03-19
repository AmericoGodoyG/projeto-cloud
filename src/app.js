/**
 * Disciplina: Computação em Nuvem II (ISW035)
 * Aplicação de Integração: Storage (Google Cloud) + Banco de Dados MySQL
 */

// Importa a biblioteca oficial do Google Cloud Storage para manipulação de buckets e objetos
const { Storage } = require('@google-cloud/storage');

// Importa o cliente MySQL com suporte nativo a Promises (async/await)
const mysql = require('mysql2/promise');

// Importa e configura o módulo dotenv para carregar as variáveis de ambiente do arquivo .env
// Isso evita a necessidade de expor credenciais (senhas e chaves) no código-fonte
require('dotenv').config();

// ============================
// CONFIGURAÇÃO DOS SERVIÇOS
// ============================

// Instancia o cliente do Google Cloud Storage.
// A autenticação é feita magicamente através do caminho do arquivo JSON da Service Account, 
// passado pela variável de ambiente GOOGLE_APPLICATION_CREDENTIALS.
const storage = new Storage();

// Obtém a referência ao bucket configurado no arquivo .env
const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);

// Nome do arquivo de teste a ser manipulado pelas funções de storage
const NOME_ARQUIVO = 'teste.txt';

// ============================
// OPERAÇÕES DE STORAGE
// ============================

/**
 * Função responsável por realizar o upload de um arquivo local para o bucket no GCP.
 */
async function uploadArquivo() {
  try {
    console.log(`\n[STORAGE] Iniciando o upload do arquivo '${NOME_ARQUIVO}'...`);
    // O método upload() envia o arquivo local para o bucket gerenciado
    await bucket.upload(`./${NOME_ARQUIVO}`);
    console.log("[STORAGE] ✅ Arquivo enviado com sucesso!");
  } catch (erro) {
    console.error(`[STORAGE] ❌ Erro ao enviar o arquivo: ${erro.message}`);
  }
}

/**
 * Função responsável por listar todos os arquivos presentes no bucket do GCP.
 */
async function listarArquivos() {
  try {
    console.log("\n[STORAGE] Listando arquivos presentes no bucket:");
    // getFiles() retorna um array onde o primeiro elemento é a lista de metadados dos arquivos
    const [files] = await bucket.getFiles();
    
    if (files.length === 0) {
      console.log("  Nenhum arquivo encontrado.");
    } else {
      files.forEach(file => {
        console.log(`  - ${file.name}`);
      });
    }
    console.log("[STORAGE] ✅ Listagem concluída.");
  } catch (erro) {
    console.error(`[STORAGE] ❌ Erro ao listar arquivos: ${erro.message}`);
  }
}

/**
 * Função responsável por excluir um arquivo específico do bucket.
 */
async function deletarArquivo() {
  try {
    console.log(`\n[STORAGE] Excluindo o arquivo '${NOME_ARQUIVO}' do bucket...`);
    // Recupera a referência do arquivo no bucket e invoca o método delete()
    await bucket.file(NOME_ARQUIVO).delete();
    console.log("[STORAGE] ✅ Arquivo deletado com sucesso!");
  } catch (erro) {
    console.error(`[STORAGE] ❌ Erro ao deletar o arquivo: ${erro.message}`);
  }
}

// ============================
// OPERAÇÕES DE BANCO DE DADOS
// ============================

/**
 * Função responsável por conectar no banco MySQL hospedado em nuvem e listar dados.
 */
async function consultarBanco() {
  let conexao;
  try {
    console.log("\n[MYSQL] Estabelecendo conexão com o Banco de Dados Gerenciado...");
    // Cria a conexão utilizando as variáveis de ambiente (.env) para evitar hardcoding
    conexao = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });

    console.log("[MYSQL] Conexão estabelecida. Consultando a tabela 'produtos'...");
    // Executa a Query e desestrutura o resultado para obter apenas as linhas (rows)
    const [rows] = await conexao.execute("SELECT * FROM produtos");

    console.log("[MYSQL] ✅ Dados retornados da tabela:");
    console.table(rows); // console.table formata o array de objetos visualmente

  } catch (erro) {
    console.error(`[MYSQL] ❌ Erro ao conectar ou consultar o banco de dados: ${erro.message}`);
  } finally {
    // Assegura o fechamento elegante da conexão com o banco para não deixar processos pendentes
    if (conexao) {
      await conexao.end();
      console.log("[MYSQL] Conexão encerrada.");
    }
  }
}

// ============================
// FLUXO PRINCIPAL DE EXECUÇÃO
// ============================

async function main() {
  console.log("==========================================");
  console.log(" INÍCIO DA INTEGRAÇÃO NUVEM II (ISW035)");
  console.log("==========================================");

  // 1. Envia o arquivo para o Bucket
  await uploadArquivo();
  
  // 2. Lista os arquivos para comprovar que o upload foi processado
  await listarArquivos();
  
  // 3. Conecta no MySQL e exibe os registros da Tabela
  await consultarBanco();
  
  // 4. Deleta o arquivo enviado para não acumular consumo atoa (Lifecycle policy manual)
  await deletarArquivo();

  console.log("\n==========================================");
  console.log(" EXECUÇÃO FINALIZADA COM SUCESSO!");
  console.log("==========================================");
}

// Dispara a execução principal do script
main();