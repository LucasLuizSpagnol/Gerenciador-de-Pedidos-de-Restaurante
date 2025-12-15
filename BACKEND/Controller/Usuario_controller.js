const express = require("express");
const usuarioService = require("../Services/Usuario_service");

const usuarioRouter = express.Router();

// =======================================================
// ROTAS DE AUTENTICAÇÃO
// =======================================================

// POST /usuario - Criar novo usuario (Cadastro)
usuarioRouter.post("/", usuarioService.criaUsuario);

// POST /usuario/login - Rota correta para o Login
// Recebe login e senha no corpo (body) da requisição
usuarioRouter.post("/login", usuarioService.loginUsuario); // <-- ROTA ADICIONADA!

// =======================================================
// ROTAS CRUD
// =======================================================

// GET /usuario/todos - Retornar todos os usuarios
usuarioRouter.get("/todos", usuarioService.retornaTodosUsuarios);

// GET /usuario/:id - Retornar usuario por ID
usuarioRouter.get("/:id", usuarioService.retornaUsuarioPorId);

// PUT /usuario/:id - Atualizar usuario
usuarioRouter.put("/:id", usuarioService.atualizaUsuario);

// DELETE /usuario/:id - Deletar usuario
usuarioRouter.delete("/:id", usuarioService.deletaUsuario);

// GET /usuario/ - Retonar usuários filtrados
usuarioRouter.get('/', usuarioService.obterUsuariosFiltro);

module.exports = usuarioRouter;