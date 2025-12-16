import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import { cadastrarUsuario } from './cadastroUsuario'; 

export default function Cadastro() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(false);
  
  const navigate = useNavigate();

  const cadastroUsuario = async () => {
    setLoading(true);
    setMensagem(null);
    setErro(false);

    try {
      // Chama a função do arquivo "cadastroUsuario" para fazer a requisição
      await cadastrarUsuario(login, senha); 

      // Sucesso no Cadastro
      setMensagem(`Cadastro realizado com sucesso! Você será redirecionado.`);
      setErro(false); 
      
      // Redirecionar para a tela de Login
      setTimeout(() => {
          navigate('/');
      }, 2000); 

    } catch (error) {
      // Tratamento de Erros 
      let erroMensagem = 'Erro ao conectar com o servidor.';
      
      if (error.response) {
        // Acessamos a resposta de erro do servidor
        erroMensagem = error.response.data.erro || error.response.data.mensagem || 'Falha ao cadastrar. Tente outro login.';
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
          Criar Cadastro
        </Typography>

        <TextField
          fullWidth
          label="Escolha um Login/E-mail"
          margin="normal"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />

        <TextField
          fullWidth
          label="Escolha uma Senha"
          type="password"
          margin="normal"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
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
          onClick={cadastroUsuario}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Cadastrar'}
        </Button>
        
        <Button 
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => navigate('/')}
        >
            Voltar para Login
        </Button>
      </Paper>
    </Box>
  );
}