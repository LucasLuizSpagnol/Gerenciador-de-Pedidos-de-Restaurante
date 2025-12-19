CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    login VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    adm BOOLEAN,
    funcionario BOOLEAN
);

CREATE TABLE alimento (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
);

CREATE TABLE acompanhamento (
    id SERIAL PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
);

CREATE TABLE pedido (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuario(id),
    data_pedido TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE item_pedido (
    id SERIAL PRIMARY KEY,
    id_pedido INTEGER NOT NULL,
    id_alimento INTEGER,
    qtd_alimento DECIMAL(10, 2),
    id_acompanhamento INTEGER,
    qtd_acompanhamento DECIMAL(10, 2)
);

-- 2. Adiciona a Chave Estrangeira para a Tabela 'pedido'
ALTER TABLE item_pedido
ADD CONSTRAINT fk_pedido
FOREIGN KEY (id_pedido)
REFERENCES pedido (id)
ON DELETE CASCADE;

-- 3. Adiciona a Chave Estrangeira para a Tabela 'alimento'
ALTER TABLE item_pedido
ADD CONSTRAINT fk_alimento
FOREIGN KEY (id_alimento)
REFERENCES alimento (id)
ON DELETE RESTRICT;

-- 4. Adiciona a Chave Estrangeira para a Tabela 'acompanhamento'
ALTER TABLE item_pedido
ADD CONSTRAINT fk_acompanhamento
FOREIGN KEY (id_acompanhamento)
REFERENCES acompanhamento (id)
ON DELETE RESTRICT;

-- 5. Adiciona uma restrição CHECK para garantir que pelo menos UM ITEM (alimento OU acompanhamento) esteja presente
-- E que sua respectiva quantidade seja maior que zero.
ALTER TABLE item_pedido
ADD CONSTRAINT chk_item_presente
CHECK (
    -- Opção 1: É um alimento. id_acompanhamento e qtd_acompanhamento devem ser NULL. id_alimento e qtd_alimento devem ser preenchidos e > 0.
    (id_alimento IS NOT NULL AND qtd_alimento > 0 AND id_acompanhamento IS NULL AND qtd_acompanhamento IS NULL)

    OR

    -- Opção 2: É um acompanhamento. id_alimento e qtd_alimento devem ser NULL. id_acompanhamento e qtd_acompanhamento devem ser preenchidos e > 0.
    (id_acompanhamento IS NOT NULL AND qtd_acompanhamento > 0 AND id_alimento IS NULL AND qtd_alimento IS NULL)
);



-- ===============================
-- USUÁRIOS
-- ===============================
INSERT INTO usuario (login, senha) VALUES
('lucas', '123456'),
('admin', 'admin123'),
('cliente01', 'senhaSegura');

-- ===============================
-- ALIMENTOS
-- ===============================
INSERT INTO alimento (nome, descricao, valor) VALUES
('Hambúrguer', 'Hambúrguer artesanal', 18.90),
('Pizza', 'Pizza Calabresa', 35.00),
('Cachorro-Quente', 'Cachorro-quente tradicional', 12.50);

-- ===============================
-- ACOMPANHAMENTOS
-- ===============================
INSERT INTO acompanhamento (nome, descricao, valor) VALUES
('Batata Frita', 'Porção média de batata frita', 8.00),
('Refrigerante', 'Lata 350ml', 5.00),
('Molho Extra', 'Molho especial da casa', 2.50);

