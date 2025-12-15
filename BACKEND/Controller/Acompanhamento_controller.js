const express = require("express");
const acompanhamentoService = require("../Services/Acompanhamento_service");

const acompanhamentoRouter = express.Router();

// POST /Acompanhamento - Criar novo Acompanhamento
acompanhamentoRouter.post("/", acompanhamentoService.criaAcompanhamento);

// GET /Acompanhamentos - Retornar todos os Acompanhamentos
acompanhamentoRouter.get("/todos", acompanhamentoService.retornaTodosAcompanhamentos);

// GET /Acompanhamento/:id - Retornar Acompanhamento por ID
acompanhamentoRouter.get("/:id", acompanhamentoService.retornaAcompanhamentoPorId);

// PUT /Acompanhamento/:id - Atualizar Acompanhamento
acompanhamentoRouter.put("/:id", acompanhamentoService.atualizaAcompanhamento);

// DELETE /Acompanhamento/:id - Deletar Acompanhamento
acompanhamentoRouter.delete("/:id", acompanhamentoService.deletaAcompanhamento);

module.exports = acompanhamentoRouter;
