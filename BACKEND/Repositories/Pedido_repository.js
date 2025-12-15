const sequelize = require('../Config/Conection');
const { 
    Pedido, 
    ItemPedido, 
    Alimento, 
    Acompanhamento, 
    Usuario 
} = require('../Models/Associations');

// Função para retornar todos os pedidos
const obterTodosPedidos = async () => {
    return await Pedido.findAll({
        // Traz Pedido com seus alimentos e acompanhamentos
        include: [
            {
                model: ItemPedido,
                as: 'itens',
                include: [
                    { model: Alimento, as: 'alimento', attributes: ['nome', 'valor'] },
                    { model: Acompanhamento, as: 'acompanhamento', attributes: ['nome', 'valor'] }
                ]
            },
            { model: Usuario, as: 'usuario', attributes: ['login'] }
        ]
    });
};

// Função para obter pedido por ID
const obterPedidoPorId = async (id) => {
    return await Pedido.findByPk(id, {
        include: [
            {
                model: ItemPedido,
                as: 'itens',
                include: [
                    { model: Alimento, as: 'alimento', attributes: ['nome', 'valor'] },
                    { model: Acompanhamento, as: 'acompanhamento', attributes: ['nome', 'valor'] }
                ]
            },
            { model: Usuario, as: 'usuario', attributes: ['login'] }
        ]
    });
};

// Função para criar um novo Pedido com seus intens (aliemnto e acompanhamento)
const criarPedidoComItens = async (dadosPedido) => {
    let transaction;
    let valorTotal = 0;
    
    try {
        transaction = await sequelize.transaction();

        // Extrai os itens e prepara os dados do pedido
        const { itens, ...pedidoHeader } = dadosPedido;
        
        // Se data_pedido não foi fornecida, usa a data atual
        if (!pedidoHeader.data_pedido) {
            pedidoHeader.data_pedido = new Date();
        }

        const novoPedido = await Pedido.create(
            { ...pedidoHeader, valor_total: 0 }, 
            { transaction }
        );

        // 3. Processa e cria os itens do pedido
        const itensParaCriar = [];
        for (const item of itens) {
            let precoUnitario = 0;
            
            // Verifica se é Alimento
            if (item.id_alimento && item.qtd_alimento > 0) {
                const alimento = await Alimento.findByPk(item.id_alimento);
                if (!alimento) throw new Error(`Alimento ID ${item.id_alimento} Não encontrado.`);
                precoUnitario = parseFloat(alimento.valor);
                valorTotal += precoUnitario * item.qtd_alimento;
                
                itensParaCriar.push({
                    id_pedido: novoPedido.id,
                    id_alimento: item.id_alimento,
                    qtd_alimento: item.qtd_alimento,
                    // Garante que os campos de acompanhamento sejam NULL
                    id_acompanhamento: null, 
                    qtd_acompanhamento: null,
                });
            } 
            
            // Verifica se é Acompanhamento
            else if (item.id_acompanhamento && item.qtd_acompanhamento > 0) {
                const acompanhamento = await Acompanhamento.findByPk(item.id_acompanhamento);
                if (!acompanhamento) throw new Error(`Acompanhamento ID ${item.id_acompanhamento} Não encontrado.`);
                precoUnitario = parseFloat(acompanhamento.valor);
                valorTotal += precoUnitario * item.qtd_acompanhamento;

                itensParaCriar.push({
                    id_pedido: novoPedido.id,
                    id_acompanhamento: item.id_acompanhamento,
                    qtd_acompanhamento: item.qtd_acompanhamento,
                    // Garante que os campos de alimento sejam NULL
                    id_alimento: null,
                    qtd_alimento: null,
                });
            }
            // Ignora itens inválidos ou com quantidade zero.
        }

        // Garante que o pedido não esteja vazio
        if (itensParaCriar.length === 0) {
            throw new Error("O pedido deve conter pelo menos um item válido.");
        }

        // Cria os ItemPedidos em massa
        await ItemPedido.bulkCreate(itensParaCriar, { transaction });

        // 4. Atualiza o valor total do pedido
        await Pedido.update(
            { valor_total: valorTotal.toFixed(2) },
            { where: { id: novoPedido.id }, transaction }
        );

        // 5. COMMIT (Confirma todas as alterações)
        await transaction.commit();

        // Retorna o pedido completo com os itens associados
        return obterPedidoPorId(novoPedido.id);

    } catch (error) {
        // Se houve erro em qualquer ponto, faz o rollback
        if (transaction) await transaction.rollback();
        throw error;
    }
};

// Função para atualizar um pedido
const atualizarPedido = async (id, dadosAtualizacao) => {
    try {
        // Retorna o número de linhas afetadas
        const [linhasAfetadas] = await Pedido.update(dadosAtualizacao, { where: { id: id } }); 

        if (linhasAfetadas === 0) {
            return null; 
        }
        return await obterPedidoPorId(id); 

    } catch (error) {
        throw error;
    }
};

// Função para deletar um pedido
const deletarPedido = async (id) => {
    try {
        const linhasDeletadas = await Pedido.destroy({ where: { id: id } });
        return linhasDeletadas > 0;
    } catch (error) {
        throw error;
    }
};

// Função para atualizar o status de um pedido
const atualizarStatus = async ({ id, status }) => {
    await Pedido.update({ status: status }, { 
        where: { id: id } 
    });
    return await Pedido.findByPk(id);
};

// Função para obter o status de um pedido
const obterStatus = async (id) => {
    return await Pedido.findByPk(id, {
        attributes: ['id', 'status'] 
    });
};

module.exports = {
    obterTodosPedidos,
    obterPedidoPorId,
    criarPedidoComItens,
    atualizarPedido,
    deletarPedido,
    atualizarStatus,
    obterStatus,
};