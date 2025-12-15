const acompanhamentoRepository = require("../Repositories/Acompanhamento_repository");

// Função para retornar todos os acompanhamentos
const retornaTodosAcompanhamentos = async (req, res) => {
    try {
        const acompanhamentos = await acompanhamentoRepository.obterTodosAcompanhamentos();
        
        const acompanhamentosFormatados = acompanhamentos.map(acompanhamento => ({
            ...acompanhamento.get({ plain: true }), // Obtém o objeto simples
            valor: parseFloat(acompanhamento.valor) // Converte string para número
        }));
        
        // Retorna o array de acompanhamentos formatado
        res.status(200).json({ acompanhamentos: acompanhamentosFormatados }); 

    } catch (error) {
        console.error("Erro ao buscar acompanhamentos:", error);
        // Garante que o frontend recebe um status de erro
        res.sendStatus(500); 
    }
};

// Função para criar o acompanhamento
const criaAcompanhamento = async (req, res) => {
    try {
        const { nome, descricao, valor } = req.body; 

        if (!nome || !valor || !descricao) {
            return res.status(400).json({ erro: 'O nome, descrição e o valor do acompanhamento são obrigatórios.' });
        }

        const novoAcompanhamento = await acompanhamentoRepository.criarAcompanhamento({
            nome,
            descricao,
            valor
        });

        return res.status(201).json(novoAcompanhamento);

    } catch (error) {
        console.error('Erro ao criar acompanhamento:', error.message);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                erro: 'Erro de Validação',
                detalhes: error.errors.map(err => err.message) 
            });
        }
        return res.status(500).json({ erro: 'Falha interna ao criar acompanhamento.' });
    }
};

// Função para atualizar o acompanhamento
const atualizaAcompanhamento = async (req, res) => {
    const { nome, descricao, valor } = req.body;
    const id = parseInt(req.params.id);
    // Cria o objeto de dados
    const dadosAtualizacao = { nome, descricao, valor };

    try {
        // Passar o ID e os dados SEPARADAMENTE
        const acompanhamentoAtualizado = await acompanhamentoRepository.atualizarAcompanhamento(
            id,
            dadosAtualizacao
        );

        if (acompanhamentoAtualizado) {
            res.status(200).json(acompanhamentoAtualizado);
        } else {
            res.status(404).json({ message: "acompanhamento não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao atualizar acompanhamento:", error);
        res.sendStatus(500);
    }
};

// Função para deletar o acompanhamento
const deletaAcompanhamento = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        const sucesso = await acompanhamentoRepository.deletarAcompanhamento(id); 

        if (sucesso) {
            res.status(200).json({
                message: "acompanhamento removido com sucesso.",
            });
        } else {
            res.status(404).json({ message: "acompanhamento não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao deletar acompanhamento:", error);
        res.status(500).json({ message: "Erro ao deletar acompanhamento" });
    }
};

// Função para retornar acompanhamento por ID
const retornaAcompanhamentoPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        const acompanhamento = await acompanhamentoRepository.obterAcompanhamentoPorId(id);

        if (acompanhamento) {
            res.status(200).json(acompanhamento);
        } else {
            res.status(404).json({ message: "acompanhamento não encontrado." });
        }
    } catch (error) {
        console.error("Erro ao buscar acompanhamento:", error);
        res.sendStatus(500);
    }
};

module.exports = {
    retornaTodosAcompanhamentos,
    criaAcompanhamento,
    atualizaAcompanhamento,
    deletaAcompanhamento,
    retornaAcompanhamentoPorId,
};