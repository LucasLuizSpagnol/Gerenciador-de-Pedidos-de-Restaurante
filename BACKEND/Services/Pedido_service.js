const { Pedido } = require('../Models/Associations');
const pedidoRepository = require("../Repositories/Pedido_repository");

// Função para criar um pedido
const criaPedido = async (req, res) => {
    try {
        const dadosPedido = req.body;
        
        // Validação simples no Service
        if (!dadosPedido.id_usuario || !dadosPedido.itens || dadosPedido.itens.length === 0) {
            return res.status(400).json({ erro: 'ID do usuário e a lista de itens são obrigatórios.' });
        }
        
        // Chama a função de transação do Repositório
        const novoPedido = await pedidoRepository.criarPedidoComItens(dadosPedido);

        // Retorna a resposta
        return res.status(201).json(novoPedido);

    } catch (error) {
        console.error('Erro ao criar pedido:', error.message);
        // Tratar erros do Repositório, como Alimento/Acompanhamento não encontrado
        if (error.message.includes('Não encontrado')) {
             return res.status(404).json({ erro: error.message });
        }
        return res.status(500).json({ erro: 'Falha interna ao criar pedido.' });
    }
};

// Função para retornar todos os pedidos
const retornaTodosPedidos = async (req, res) => {
    try {
        const pedidos = await pedidoRepository.obterTodosPedidos();
        res.status(200).json({ pedidos });
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        res.sendStatus(500);
    }
};

// Função para retorna um pedido por ID
const retornaPedidoPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const pedido = await pedidoRepository.obterPedidoPorId(id);

        if (pedido) {
            res.status(200).json(pedido);
        } else {
            res.status(404).json({ message: "Pedido não encontrado." });
        }
    } catch (error) {
        console.error("Erro ao buscar pedido:", error);
        res.sendStatus(500);
    }
};

// Função para atualizar um pedido
const atualizaPedido = async (req, res) => {
    const id = parseInt(req.params.id);
    const dadosAtualizacao = req.body;
    try {
        // Se o Pedido não existir, retornará null
        const pedidoAtualizado = await pedidoRepository.atualizarPedido(id, dadosAtualizacao); 

        if (pedidoAtualizado) { 
            res.status(200).json(pedidoAtualizado);
        } else {
            res.status(404).json({ message: "Pedido não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao atualizar pedido:", error);
        res.sendStatus(500);
    }
};

// Função para deletar pedido
const deletaPedido = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const sucesso = await pedidoRepository.deletarPedido(id);

        if (sucesso) {
            res.status(200).json({ message: "Pedido removido com sucesso." });
        } else {
            res.status(404).json({ message: "Pedido não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao deletar pedido:", error);
        res.status(500).json({ message: "Erro ao deletar pedido" });
    }
};

// Função para atualizar o status do pedido
const atualizaStatusPedido = async (req, res) => {
    const pedidoId = parseInt(req.params.id);
    const { novoStatus } = req.body;

    if (!novoStatus) {
        return res.status(400).json({ erro: 'O novo status é obrigatório.' });
    }

    try {
        const pedidoAtualizado = await pedidoRepository.atualizarStatus({
            id: pedidoId, 
            status: novoStatus
        });

        if (pedidoAtualizado) {
            return res.status(200).json(pedidoAtualizado);
        } else {
            return res.status(404).json({ erro: `Pedido ID ${pedidoId} não encontrado.` });
        }
    } catch (error) {
        console.error('ERRO ao atualizar status do pedido:', error);
        return res.status(500).json({ erro: 'Falha interna ao atualizar o status.' });
    }
};
// Função para obter pedido por id
const obterStatusPedidoController = async (req, res) => {
    const pedidoId = parseInt(req.params.id);

    console.log(`[BACKEND LOG] Tentando obter status para o ID: ${pedidoId}`); 

    try {
        const pedido = await pedidoRepository.obterStatus(pedidoId); 

        console.log(`[BACKEND LOG] Pedido encontrado:`, pedido); 

        if (pedido) {
            return res.status(200).json(pedido);
        } else {
            return res.status(404).json({ erro: `Pedido ID ${pedidoId} não encontrado.` });
        }
    } catch (error) {
        console.error('ERRO REAL DO SERVIDOR:', error);
        return res.status(500).json({ erro: 'Falha interna ao obter o status.' });
    }
};

module.exports = {
    criaPedido,
    retornaTodosPedidos,
    retornaPedidoPorId,
    atualizaPedido,
    deletaPedido,
    atualizaStatusPedido,
obterStatusPedidoController,
};