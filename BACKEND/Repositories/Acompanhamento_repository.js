const { Acompanhamento: AcompanhamentoModel } = require('../Models/Associations');

// Função para obter todos os acompanhamentos
const obterTodosAcompanhamentos = async () => {
    return await AcompanhamentoModel.findAll();
};

// Função para obter o acompanhamento por ID
const obterAcompanhamentoPorId = async (id) => {
    return await AcompanhamentoModel.findByPk(id);
};

// Função para criar um novo acompanhamento
const criarAcompanhamento = async (dadosAcompanhamento) => {
    const novoAcompanhamento = await AcompanhamentoModel.create(dadosAcompanhamento);
    return novoAcompanhamento;
};

// Função para atualizar um acomoanhamento
const atualizarAcompanhamento = async (id, dadosAtualizacao) => {
    try {
        await AcompanhamentoModel.update(dadosAtualizacao, { where: { id: id } });
        return await AcompanhamentoModel.findByPk(id);
    } catch (error) {
        throw error;
    }
};
// Função para deletar um novo alimento
const deletarAcompanhamento = async (id) => {
    try {
        const linhasDeletadas = await AcompanhamentoModel.destroy({ where: { id: id } });
        return linhasDeletadas > 0;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    obterTodosAcompanhamentos,
    obterAcompanhamentoPorId,
    criarAcompanhamento,
    atualizarAcompanhamento,
    deletarAcompanhamento,
};