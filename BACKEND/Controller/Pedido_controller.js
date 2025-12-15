const express = require("express");
const pedidoService = require("../Services/Pedido_service");

const pedidoRouter = express.Router();

// POST /pedido - Criar novo pedido
pedidoRouter.post("/", pedidoService.criaPedido);

// GET /pedidos - Retornar todos os pedidos
pedidoRouter.get("/todos", pedidoService.retornaTodosPedidos);

// GET /pedido/:id - Retornar pedido por ID
pedidoRouter.get("/:id", pedidoService.retornaPedidoPorId);

// PUT /pedido/:id - Atualizar pedido
pedidoRouter.put("/:id", pedidoService.atualizaPedido);

// DELETE /pedido/:id - Deletar pedido
pedidoRouter.delete("/:id", pedidoService.deletaPedido);

// PUT /pedido/status:id - Atualizar o status do pedido
pedidoRouter.put('/status/:id', pedidoService.atualizaStatusPedido);

// GET /pedido/status:id - Petornar o status do pedido referente ao id
pedidoRouter.get('/status/:id', pedidoService.obterStatusPedidoController);

module.exports = pedidoRouter;
