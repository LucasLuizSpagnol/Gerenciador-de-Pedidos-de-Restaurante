const express = require("express");
const AlimentoService = require("../Services/Alimento_service");

const AlimentoRouter = express.Router();

// POST /Alimento - Criar novo Alimento
AlimentoRouter.post("/", AlimentoService.criaAlimento);

// GET /Alimentos - Retornar todos os Alimentos
AlimentoRouter.get("/todos", AlimentoService.retornaTodosAlimentos);

// GET /Alimento/:id - Retornar Alimento por ID
AlimentoRouter.get("/:id", AlimentoService.retornaAlimentoPorId);

// PUT /Alimento/:id - Atualizar Alimento
AlimentoRouter.put("/:id", AlimentoService.atualizaAlimento);

// DELETE /Alimento/:id - Deletar Alimento
AlimentoRouter.delete("/:id", AlimentoService.deletaAlimento);

module.exports = AlimentoRouter;
