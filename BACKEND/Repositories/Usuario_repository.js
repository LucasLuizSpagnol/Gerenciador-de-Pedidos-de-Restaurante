const { Usuario: UsuarioModel } = require('../Models/Associations');
const { Op } = require('sequelize');

// Função para obter todos os usuários
const obterTodosUsuarios = async () => {
    return await UsuarioModel.findAll(); 
};

// Função para obter o usuário po ID
const obterUsuarioPorId = async (usuario) => {
    return await UsuarioModel.findByPk(usuario.id); 
};

// Função para criar o usuário
const criarUsuario = async (usuario) => {
    const novoUsuario = await UsuarioModel.create(usuario); 
    return novoUsuario;
};
// Função para atualizar o usuário
const atualizarUsuario = async (usuario) => {
    try {
        await UsuarioModel.update(usuario, { where: { id: usuario.id } });
        return await UsuarioModel.findByPk(usuario.id);
    } catch (error) {
        throw error;
    }
};

// Função para deletar o usuário
const deletarUsuario = async (usuario) => {
    try {
        const rowsDeleted = await UsuarioModel.destroy({ where: { id: usuario.id } });
        return rowsDeleted > 0;
    } catch (error) {
        throw error;
    }
};


const obterUsuarioPorLogin = async (login) => {
    return await UsuarioModel.findOne({ 
        where: { login: login } 
    });
};

// Função para retornar usuário filtrados
const obterUsuariosFiltrados = async (filtro = 'todos') => {
    let whereClause = {};

    // Constrói a cláusula WHERE baseada no filtro
    if (filtro === 'adm') {
        whereClause = { adm: true }; 
        
    } else if (filtro === 'funcionario') {
        whereClause = { 
            [Op.and]: [
                { funcionario: true },
                { adm: false }
            ]
        };
    } 

    // Executa a consulta
    return await UsuarioModel.findAll({
        where: whereClause,
        order: [['login', 'ASC']] 
    });
};

module.exports = {
    obterTodosUsuarios,
    obterUsuarioPorId,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario,
    obterUsuarioPorLogin,
    obterUsuariosFiltrados,
};