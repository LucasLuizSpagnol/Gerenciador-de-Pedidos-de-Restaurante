const { Alimento: AlimentoModel } = require('../Models/Associations'); 

// Função para retornar todos os alimentos
const obterTodosAlimentos = async () => {
    return await AlimentoModel.findAll();
};

// Função para obter um alimento por ID
const obterAlimentoPorId = async (id) => {
    return await AlimentoModel.findByPk(id);
};

// Função para criar um novo alimento
const criarAlimento = async (dadosAlimento) => {
    const novoAlimento = await AlimentoModel.create(dadosAlimento);
    return novoAlimento;
};

// Função para atualizar um alimento
const atualizarAlimento = async (id, dadosAtualizacao) => {
    try {
        await AlimentoModel.update(dadosAtualizacao, { where: { id: id } });
        return await AlimentoModel.findByPk(id);
    } catch (error) {
        throw error;
    }
};

// Função para deletar um novo alimento
const deletarAlimento = async (id) => {
    try {
        const linhasDeletadas = await AlimentoModel.destroy({ where: { id: id } });
        return linhasDeletadas > 0;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    obterTodosAlimentos,
    obterAlimentoPorId,
    criarAlimento,
    atualizarAlimento,
    deletarAlimento,
};