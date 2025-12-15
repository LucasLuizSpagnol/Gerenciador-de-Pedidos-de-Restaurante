const usuarioRepository = require("../Repositories/Usuario_repository");
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { Sequelize, UniqueConstraintError } = require('sequelize');

// Função para retornar todos os Usuarios
const retornaTodosUsuarios = async (req, res) => {
	try {
		const usuarios = await usuarioRepository.obterTodosUsuarios();
		res.status(200).json({ usuarios: usuarios });
	} catch (error) {
		console.log("Erro ao buscar usuarios:", error);
		res.sendStatus(500);
	}
};

// Função para criar o usuário
const criaUsuario = async (req, res) => {
    try {
        // Captura os campos, definindo defaults seguros para adm e funcionario
        const { login, senha } = req.body; 
        let { adm, funcionario } = req.body; 

        if (!login || !senha) {
            return res.status(400).json({ mensagem: 'Login e senha são obrigatórios.' });
        }

        if (adm === undefined || adm === null) {
            adm = false;
        }
        if (funcionario === undefined || funcionario === null) {
            funcionario = false;
        }

        // Conversão de valores booleanos para garantir que sejam salvos corretamente
        const ehAdm = adm === true || adm === 'true';
        const ehFuncionario = funcionario === true || funcionario === 'true';
        
        // Usa o Hash para criptografar a senha
        const senhaHash = await bcrypt.hash(senha, saltRounds);
        
        const novoUsuario = await usuarioRepository.criarUsuario({
            login,
            senha: senhaHash,
            adm: ehAdm,             
            funcionario: ehFuncionario 
        });

        // Sucesso
        return res.status(201).json({ 
            mensagem: 'Usuário cadastrado com sucesso.',
            usuario: { 
                login: novoUsuario.login, 
                id: novoUsuario.id,
                adm: novoUsuario.adm,
                funcionario: novoUsuario.funcionario
            }
        });

    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return res.status(500).json({ erro: 'Verifique se esse usuário já existe.' });
    }
};
// Função para atualizar o usuário
const atualizaUsuario = async (req, res) => {
    const { login, senha } = req.body; 
    const id = parseInt(req.params.id);

    try {
        const usuarioExistente = await usuarioRepository.obterUsuarioPorId({ id });
        
        if (!usuarioExistente) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Objeto que será enviado ao repositório
        let dadosParaAtualizar = { login };

        // 1. Tratamento dos Campos de Perfil (adm, funcionario)
        if (req.body.adm !== undefined) {
             dadosParaAtualizar.adm = req.body.adm === true || req.body.adm === 'true';
        }
        if (req.body.funcionario !== undefined) {
             dadosParaAtualizar.funcionario = req.body.funcionario === true || req.body.funcionario === 'true';
        }

        // 2. Tratamento da Senha
        if (senha) {
            const senhaHash = await bcrypt.hash(senha, saltRounds);
            dadosParaAtualizar.senha = senhaHash; 
        }
        
        // 3. Chama o a função do repositório
        const usuarioAtualizado = await usuarioRepository.atualizarUsuario({
            id: id,
            ...dadosParaAtualizar, 
        });

        if (usuarioAtualizado) {
             const { senha, ...usuarioSeguro } = usuarioAtualizado; 
             res.status(200).json(usuarioSeguro);
        } else {
            res.status(404).json({ message: "Usuário não encontrado durante a atualização." }); 
        }
        
    } catch (error) {
        
        console.error("Erro ao atualizar usuário:", error);
        return res.status(500).json({ erro: 'Verifique se esse usuario já existe.' });
    }
};

// Função para deletar um usuario
const deletaUsuario = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const usuarioRemovido = await usuarioRepository.deletarUsuario({ id });

		if (usuarioRemovido) {
			res.status(200).json({
				message: "usuario removido com sucesso.",
				usuario: usuarioRemovido,
			});
		} else {
			res.status(404).json({ message: "usuario não encontrado" });
		}
	} catch (error) {
		console.error("Erro ao deletar usuario:", error);
		res.status(500).json({ message: "Erro ao deletar usuario" });
	}
};

// Função para retornar usuario por ID
const retornaUsuarioPorId = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const usuario = await usuarioRepository.obterUsuarioPorId({
			id,
		});

		if (usuario) {
			res.status(200).json(usuario);
		} else {
			res.status(404).json({ message: "usuario não encontrado." });
		}
	} catch (error) {
		console.log("Erro ao buscar usuario:", error);
		res.sendStatus(500);
	}
};
// Função para o login do usuário
const loginUsuario = async (req, res) => {
    const { login, senha } = req.body;

    if (!login || !senha) {
        return res.status(400).json({ mensagem: 'Login e senha são obrigatórios.' });
    }

    try {

        const usuario = await usuarioRepository.obterUsuarioPorLogin(login); 

        if (!usuario) {
            return res.status(401).json({ mensagem: 'Login ou senha inválidos.' });
        }

        // Veficação CRÍTICA: Compara a senha digitada com o hash armazenado no DB
        const senhaValida = await bcrypt.compare(senha, usuario.senha); 

        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Login ou senha inválidos.' });
        }

        let perfil;
        if (usuario.adm) {
            perfil = 'ADMINISTRADOR';
        } else if (usuario.funcionario) {
            perfil = 'FUNCIONARIO';
        } else {
            perfil = 'COMUM';
        }

        return res.status(200).json({ 
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                id_usuario: usuario.id,
                login: usuario.login,
                perfil: perfil,
            }
        });
    } catch (error) {
        console.error('ERRO CRÍTICO NO LOGIN:', error);
        return res.status(500).json({ erro: 'Falha interna no servidor.' });
    }
};

// Função para obter usuários filtrados
const obterUsuariosFiltro = async (req, res) => {
    try {
        // Captura o parâmetro 'filtro' da URL
        // Se 'filtro' não for fornecido, será 'todos' por padrão.
        const filtro = req.query.filtro || 'todos'; 

        // Chama a função do repositório
        const usuarios = await usuarioRepository.obterUsuariosFiltrados(filtro);

        return res.status(200).json(usuarios);

    } catch (error) {
        console.error('Erro ao obter usuários:', error.message);
        return res.status(500).json({ erro: 'Falha interna ao obter lista de usuários.' });
    }
};

module.exports = {
	retornaTodosUsuarios,
	criaUsuario,
	atualizaUsuario,
	deletaUsuario,
	retornaUsuarioPorId,
	loginUsuario,
    obterUsuariosFiltro
};
