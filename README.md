# 📋 Atividade 4.1 — Armazenamento de Dados em Nuvem e Banco Relacional

**Disciplina:** Computação em Nuvem II (ISW035)  
**Professor:** Ronan Adriel Zenatti — FATEC Jahu / Centro Paula Souza  

> Aluno: Américo Godoy da Silva 
> Semestre: 2026/01

---

## 1. Descrição do Projeto

Este projeto consiste em uma aplicação backend escrita em JavaScript (Node.js) que se integra com dois serviços em nuvem para demonstrar operações de infraestrutura na prática:

- **Google Cloud Storage (GCP):** Faz o upload de um arquivo local, lista todos os arquivos no repositório em nuvem e, por fim, deleta o arquivo inserido.
- **MySQL Gerenciado:** Efetua uma conexão a uma base de dados externa gerenciada em nuvem, lê e extrai registros pré-preenchidos em uma tabela chamada `produtos`.

---

## 2. Tecnologias e Serviços Utilizados

**Plataforma Escolhida:** Google Cloud Platform (GCP).  
**Justificativa:** A plataforma foi escolhida devido à familiaridade dos comandos, a cota atraente e acessível do free tier do GCP, além da facilidade na geração de arquivos de credenciais para as Service Accounts, viabilizando conexões estáveis da minha máquina local com a nuvem.

### Serviços Provisionados:
- **Cloud Storage:** Criação do Bucket `bucket-americo-123` em classe de redundância "Regional Standard".
- **Cloud SQL for MySQL:** Instância `mysql-americo`, porta padrão (3306), na mesma rede configurada e IP restrito para os testes de casa.

---

## 3. Diagrama de Arquitetura

```mermaid
graph LR
    subgraph "Sua Máquina (Local)"
        A[Aplicação Node.js\n'src/app.js']
    end
    
    subgraph "Google Cloud Platform (GCP)"
        B[(Cloud SQL - MySQL)]
        C[[Cloud Storage - Bucket]]
    end
    
    A -->|1. Conecta via Variáveis \n (.env)| B
    A -->|2. Executa Instruções SQL \n (SELECT)| B
    
    A -->|3. Autentica via \nService Account Key| C
    A -->|4. Upload / GetFiles / Delete| C
```

---

## 4. Configuração dos Serviços (Passo a Passo)

1. **Storage (Google Cloud Storage):**
   - Acessei a aba "Storage" na Console do Google Cloud.
   - Cliquei em "Criar Bucket", escolhi uma região local, selecionei a camada Padrão (Standard) de custos, e mantive o controle de acesso e encriptação gerenciados nativamente pela Google.
   
2. **Banco de Dados (Cloud SQL for MySQL):**
   - Acessei o menu de "SQL" e cliquem em "Criar Instância", selecionando MySQL.
   - Optei pelos recursos de ambiente mais simples e de baixo custo (`mysql-americo`). Defini um usuário base (`` ou usuário secundário) e sua senha.
   - Fui na guia Redes ("Connections / Networking"), adicionei a aba e permiti o tráfego do meu IP local para a rede pública.

3. **Chave da Service Account:**
   - Acessei o IAM & Admin > Service Accounts e criei uma conta com o papel `Storage Admin`.
   - Na aba Keys ("Chaves"), gerei e fiz o download de uma chave no formato JSON e importei o arquivo `chave.json` para dentro do meu projeto. 
   - _NOTA: A chave foi devidamente rastreada via arquivo `.gitignore` e blindada de envio ao repositório!_

---

## 5. Estrutura da Tabela do Banco de Dados

A base de dados `app_projeto` com a tabela `produtos` contém o seguinte esquema criado pela query disponível em `sql/schema.sql`:

| id | nome | descricao | preco | categoria | criado_em |
|:---|:---|:---|:---|:---|:---|
| 1 | Notebook Gamer | Notebook 16GB RAM, RTX 4060 | 5499.90 | Eletrônicos | 202x-xx-xx |
| 2 | Mouse Wireless | Mouse ergonômico sem fio | 149.90 | Periféricos | 202x-xx-xx |
| ... | ... | ... | ... | ... | ... |

---

## 6. Pré-requisitos & Instalação

* **Node.js** v14 ou superior.
* Acesso autorizado pelo MySQL.
* Ter realizado download da Chave JSON da conta de serviço.

### Como Executar

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/americogodoy/projeto-cloud.git
   cd projeto-cloud
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Copie ou crie o arquivo `.env` a partir do exemplo configurado:
   ```bash
   cp .env.example .env
   ```
   Abra o arquivo `.env` gerado e inclua todas suas credenciais de nuvem conforme orientação do professor e das chaves lá presentes.

4. **Execute o App:**
   ```bash
   node src/app.js
   ```

---

## 7. Evidências de Execução

Imagens documentando a correta execução deste código encontram-se na pasta raiz `evidencias/` deste repositório:


