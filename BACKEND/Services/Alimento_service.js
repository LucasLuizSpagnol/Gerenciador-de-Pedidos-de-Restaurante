const alimentoRepository = require("../Repositories/Alimento_repository");

// Função para retornar todos os alimentos
const retornaTodosAlimentos = async (req, res) => {
    try {
        const alimentos = await alimentoRepository.obterTodosAlimentos();
        
        const alimentosFormatados = alimentos.map(alimento => ({
            ...alimento.get({ plain: true }), // Obtém o objeto simples
            valor: parseFloat(alimento.valor) // Converte string para número
        }));
        
        // Retorna a lista formatada
        res.status(200).json({ alimentos: alimentosFormatados });} catch (error) {
        console.error("Erro ao buscar alimentos:", error);
        res.sendStatus(500);
    }
};

// Função para criar um novo alimento
const criaAlimento = async (req, res) => {
    try {
        const { nome, descricao, valor } = req.body; 

        if (!nome || !valor || !descricao) {
            return res.status(400).json({ erro: 'O nome, descrição e o valor do alimento são obrigatórios.' });
        }

        const novoAlimento = await alimentoRepository.criarAlimento({
            nome,
            descricao,
            valor
        });

        return res.status(201).json(novoAlimento);

    } catch (error) {
        console.error('Erro ao criar alimento:', error.message);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                erro: 'Erro de Validação',
                detalhes: error.errors.map(err => err.message) 
            });
        }
        return res.status(500).json({ erro: 'Falha interna ao criar alimento.' });
    }
};

// Função para atualizar um alimento
const atualizaAlimento = async (req, res) => {
    const { nome, descricao, valor } = req.body;
    const id = parseInt(req.params.id);
    const dadosAtualizacao = { nome, descricao, valor };

    try {
        const alimentoAtualizado = await alimentoRepository.atualizarAlimento(
            id,
            dadosAtualizacao
        );

        if (alimentoAtualizado) {
            res.status(200).json(alimentoAtualizado);
        } else {
            res.status(404).json({ message: "alimento não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao atualizar alimento:", error);
        res.sendStatus(500);
    }
};

// Função para deletar um alimento
const deletaAlimento = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const sucesso = await alimentoRepository.deletarAlimento(id);

        if (sucesso) {
            res.status(200).json({
                message: "alimento removido com sucesso.",
            });
        } else {
            res.status(404).json({ message: "alimento não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao deletar alimento:", error);
        res.status(500).json({ message: "Erro ao deletar alimento" });
    }
};

// Função para buscar alimento por ID
const retornaAlimentoPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const alimento = await alimentoRepository.obterAlimentoPorId(id);

        if (alimento) {
            res.status(200).json(alimento);
        } else {
            res.status(404).json({ message: "alimento não encontrado." });
        }
    } catch (error) {
        console.error("Erro ao buscar alimento:", error);
        res.sendStatus(500);
    }
};

module.exports = {
    retornaTodosAlimentos,
    criaAlimento,
    atualizaAlimento,
    deletaAlimento,
    retornaAlimentoPorId,
};