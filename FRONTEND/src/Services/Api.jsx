import axios from 'axios';

// URL base
const API_BASE_URL = 'http://localhost:3002'; 

// URL base para o pedido
const API_PEDIDO_URL = `${API_BASE_URL}/pedido`; 
const API_ALIMENTO_URL = `${API_BASE_URL}/alimento`; 
const API_ACOMPANHAMENTO_URL = `${API_BASE_URL}/acompanhamento`;
const API_USUARIO_URL = `${API_BASE_URL}/usuario`; 

// Funções para obter o menu
export const obterAlimentosDoMenu = async () => {
    const endpoint = `${API_BASE_URL}/alimento/todos`; 
    const response = await axios.get(endpoint);
    return response.data;
};

// Funções para obter o menu
export const obterAcompanhamentosDoMenu = async () => {
    const endpoint = `${API_BASE_URL}/acompanhamento/todos`;
    const response = await axios.get(endpoint);
    return response.data;
};

// Função para deletar um pedido por ID
export const deletarPedidoApi = async (pedidoId) => {
    const endpoint = `${API_PEDIDO_URL}/${pedidoId}`; 
    const response = await axios.delete(endpoint); 
    return response.data;
};

// Função para obter a lista completa de pedidos
export const obterTodosPedidos = async () => {
    const endpoint = `${API_BASE_URL}/pedido/todos`; 
    const response = await axios.get(endpoint);
    return response.data.pedidos;
};

// Função para atualizar o status (PUT /pedido/:id)
export const atualizarStatusPedido = async (id, novoStatus) => {
    const endpoint = `${API_BASE_URL}/pedido/status/${id}`; 
    const response = await axios.put(endpoint, { novoStatus });
    return response.data;
};

// Função para obter o pedido por ID
export async function obterPedidoPorId(idPedido) {
    if (!idPedido) {
        throw new Error("ID do pedido não fornecido.");
    }
    
    try {
        const url = `${API_PEDIDO_URL}/${idPedido}`; 
        
        const response = await axios.get(url); 

        return response.data; 
        
    } catch (error) {
        console.error(`Erro ao obter pedido #${idPedido}:`, error);

        // Gera uma mensagem de erro mais útil para o frontend, se possível
        const status = error.response ? error.response.status : 'N/A';
        const erroMsg = error.response && error.response.data && error.response.data.message 
                      ? error.response.data.message 
                      : `Erro de rede ou backend. Status: ${status}`;
                      
        throw new Error(erroMsg); 
    }
}

// Função para obter o status do pedido 
export const obterStatusPedido = async (idPedido) => {
    const url = `${API_PEDIDO_URL}/status/${idPedido}`; 
    
    const response = await axios.get(url);
    
    return response.data; 
};

// Função para criar o pedido
export const criarPedidoCompleto = async (pedidoData) => {
    const endpoint = `${API_PEDIDO_URL}/`; 

    const response = await axios.post(endpoint, pedidoData);

    return response.data;
};

// Função para criar alimento
export const criarAlimento = async (alimentoData) => {
    const response = await axios.post(API_ALIMENTO_URL, alimentoData);
    return response.data;
};

// Função para atualizar alimento
export const atualizarAlimento = async (id, alimentoData) => {
    const response = await axios.put(`${API_ALIMENTO_URL}/${id}`, alimentoData);
    return response.data;
};

// Função para deletar alimento
export const deletarAlimento = async (id) => {
    await axios.delete(`${API_ALIMENTO_URL}/${id}`);
    return id;
};

// Função para criar acompanhamento
export const criarAcompanhamento = async (acompanhamentoData) => {
    const response = await axios.post(API_ACOMPANHAMENTO_URL, acompanhamentoData);
    return response.data;
};

// Função para atualizar acompanhamento
export const atualizarAcompanhamento = async (id, acompanhamentoData) => {
    const response = await axios.put(`${API_ACOMPANHAMENTO_URL}/${id}`, acompanhamentoData);
    return response.data;
};

// Função para deletar acompanhamento
export const deletarAcompanhamento = async (id) => {
    await axios.delete(`${API_ACOMPANHAMENTO_URL}/${id}`);
    return id; 
};

// Função para obter todos os usuários
export const obterUsuarios = async (filtro = 'todos') => {
    const response = await axios.get(`${API_USUARIO_URL}?filtro=${filtro}`);
    return response.data;
};

// Função para criar usuário
export const criarUsuario = async (usuarioData) => {
    // É crucial que esta função receba e envie a senha.
    const response = await axios.post(API_USUARIO_URL, usuarioData);
    return response.data;
};

// Função para atualizar usuário
export const atualizarUsuario = async (id, usuarioData) => {
    const response = await axios.put(`${API_USUARIO_URL}/${id}`, usuarioData);
    return response.data;
};

// Função para deletar usuário
export const deletarUsuario = async (id) => {
    await axios.delete(`${API_USUARIO_URL}/${id}`);
    return id; 
};
