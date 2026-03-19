-- schema.sql — Criação da tabela e inserção de dados iniciais
-- Disciplina: Computação em Nuvem II (ISW035)

CREATE DATABASE IF NOT EXISTS app_projeto;
USE app_projeto;

CREATE TABLE IF NOT EXISTS produtos (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(100)   NOT NULL,
    descricao   TEXT,
    preco       DECIMAL(10,2)  NOT NULL,
    categoria   VARCHAR(50),
    criado_em   DATETIME       DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO produtos (nome, descricao, preco, categoria) VALUES
    ('Notebook Gamer', 'Notebook 16GB RAM, RTX 4060', 5499.90, 'Eletrônicos'),
    ('Mouse Wireless', 'Mouse ergonômico sem fio', 149.90, 'Periféricos'),
    ('Teclado Mecânico', 'Teclado switch blue, RGB', 329.90, 'Periféricos'),
    ('Monitor 27"', 'Monitor IPS 144Hz', 1899.00, 'Eletrônicos'),
    ('Webcam Full HD', 'Webcam 1080p com microfone', 249.90, 'Periféricos');
