import axios from 'axios';

// URL base do USUÁRIO no backend
const API_BASE_URL = 'http://localhost:3002/usuario/'; 

export const cadastrarUsuario = async (login, senha) => {
    
    const response = await axios.post(API_BASE_URL, {
        login,
        senha
    });
    
    return response.data;
};