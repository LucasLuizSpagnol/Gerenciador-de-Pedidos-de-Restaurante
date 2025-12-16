import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import axios from 'axios'; 
import { useNavigate } from "react-router-dom"; 

// URL base do usuário
const API_URL = 'http://localhost:3002/usuario'; 

export default function Login() {
  const [login, setLogin] = useState(""); 
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(false);
  
  const navigate = useNavigate(); 

  const loginUsuario = async () => {
    setLoading(true);
    setMensagem(null);
    setErro(false);

    const endpoint = `${API_URL}/login`;

    try {
      const response = await axios.post(endpoint, {
        login: login, 
        senha: senha
      });
      console.log("Dados do Usuário (Objeto 'usuario'):", response.data.usuario);
      
      const userId = response.data.usuario.id_usuario; 
      const userLogin = response.data.usuario.login;
      // Captura o perfil do usuário
      const userProfile = response.data.usuario.perfil; 
      
      if (userId && userProfile) {
        // Salva o ID e o objeto completo
        localStorage.setItem('id_usuario_logado', String(userId));
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // Feedback de sucesso
        setMensagem(`Login realizado com sucesso! Bem-vindo(a), ${userLogin}.`);
        setErro(false); 

        // 2. Lógica de redirecionamento condicional
        let rotaRedirecionamento = '/';

        switch (userProfile.toUpperCase()) {
          case 'ADMINISTRADOR':
            // Rota para Menu de Alimentos e Usuários
            rotaRedirecionamento = '/gerenciamento';
            break;
          case 'FUNCIONARIO':
            // Rota para menu de gerenciamento de pedidos (Cozinha)
            rotaRedirecionamento = '/gerenciamentoPedidos';
            break;
          case 'COMUM':
          default:
            // Rota para a Tela Principal de Pedidos (Cliente)
            rotaRedirecionamento = '/principal'; 
            break;
        }

        // Redirecionamento
        setTimeout(() => {
            navigate(rotaRedirecionamento); 
        }, 500);

      } else {
         // Se a resposta 200 não contiver o ID ou o Perfil
         setMensagem("Falha na autenticação. Dados do usuário incompletos.");
         setErro(true);
      }

    } catch (error) {
      let erroMensagem = 'Não foi possível conectar ao servidor.';
      
      if (error.response) {
        erroMensagem = error.response.data.mensagem || 'Credenciais inválidas. Tente novamente.';
      }

      setMensagem(erroMensagem);
      setErro(true); 

    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5"
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          width: 350,
          borderRadius: 3
        }}
      >
        <Typography variant="h5" textAlign="center" mb={2}>
          Login
        </Typography>

        <TextField
          fullWidth
          label="login"
          margin="normal"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <TextField
          fullWidth
          label="Senha"
          type="password"
          margin="normal"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {mensagem && (
            <Alert severity={erro ? "error" : "success"} sx={{ mt: 2 }}>
                {mensagem}
            </Alert>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, height: 45 }}
          onClick={loginUsuario}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
        </Button>
        
        <Button 
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => navigate('/cadastro')} 
        >
            Criar Cadastro
        </Button>
      </Paper>
    </Box>
  );
}