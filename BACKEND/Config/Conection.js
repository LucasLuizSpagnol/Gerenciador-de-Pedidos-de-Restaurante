const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    host: "localhost",
    port: 5432,
    database: "RESTAURANTE_TESTE", 
    username: "postgres",
    password: "98376162",
    dialect: "postgres",
    logging: false,
});

// Autentica (testa a conexão)
async function conectaBancoDeDados() {
    try {
        await sequelize.authenticate();
        console.log('Sequelize conectado ao PostgreSQL com sucesso!');
    } catch (error) {
        console.error('ERRO: Sequelize não conseguiu conectar ao banco:', error);
    }
}

conectaBancoDeDados();

module.exports = sequelize;