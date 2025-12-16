import React, { useState } from 'react';
import { 
  Box, Typography, Button, Stack, CircularProgress, Alert, 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow 
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import Lista from '../Components/Lista'; 

// Importa funções do menu, criação de pedido e a função de status
import { 
  obterAlimentosDoMenu, 
  obterAcompanhamentosDoMenu,
  criarPedidoCompleto,
  obterStatusPedido,
  deletarPedidoApi,
} from '../Services/Api'; 

export default function Principal() {
  const [tabelaVisivel, setTabelaVisivel] = useState(null);
  const [alimentos, setAlimentos] = useState([]);
  const [acompanhamentos, setAcompanhamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // ESTADO DO CARRINHO (Em Montagem)
  const [pedidoAtual, setPedidoAtual] = useState([]); 
  const [pedidoConcluido, setPedidoConcluido] = useState(null); // ID do pedido criado
  // Armazena os detalhes do pedido recém-finalizado
  const [ultimoPedidoDetalhes, setUltimoPedidoDetalhes] = useState(null);
  
  const [statusVerificado, setStatusVerificado] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

const deletarPedido = async () => {
    if (!pedidoConcluido || !statusVerificado) {
        setError("Não há pedido concluído ou status verificado para deletar.");
        return;
    }

    // Use 'PENDENTE' ou o status que sua API retorna quando o pedido não foi processado.
    const statusPendente = "Pendente";
    
    if (statusVerificado.toUpperCase().includes(statusPendente)) {

        if (!window.confirm(`Tem certeza que deseja DELETAR o Pedido ID ${pedidoConcluido} (Status: ${statusVerificado})? Esta ação é irreversível.`)) {
            return;
        }

        setLoadingStatus(true);
        setError(null);
        
        try {
            await deletarPedidoApi(pedidoConcluido);

            // 2. Ações de sucesso: Limpar todos os estados de pedido
            setUltimoPedidoDetalhes(null);
            setPedidoConcluido(null);
            setStatusVerificado(null);
            setPedidoAtual([]);
            
            alert(`Pedido ID ${pedidoConcluido} deletado com sucesso!`);
            
        } catch (e) {
            console.error("Erro ao deletar pedido:", e);
            const msg = e.response && e.response.status === 404 
                        ? `Pedido ID ${pedidoConcluido} não encontrado (404).`
                        : "Não foi possível deletar o pedido. Tente novamente.";
            setError(msg);
        } finally {
            setLoadingStatus(false);
        }
    } else {
        // Se o status não for o correto para deleção
        setError(`O pedido ID ${pedidoConcluido} não pode ser deletado porque o status atual é "${statusVerificado}".`);
    }
};

const verificarStatus = async () => {
    if (!pedidoConcluido) {
        setStatusVerificado("Nenhum pedido recente foi finalizado.");
        return;
    }

    setLoadingStatus(true);
    setError(null);

    try {
        const responseData = await obterStatusPedido(pedidoConcluido);
        
        // 🚨 NOVO LOG: Veja o que a API está realmente retornando
        console.log("Resposta da API de Status:", responseData);
        
        let novoStatus;
        
        if (responseData && responseData.status) {
            // O formato esperado: { id: X, status: '...' }
            novoStatus = responseData.status;
        } else if (typeof responseData === 'string') {
            // Caso o backend retorne apenas o texto do status
            novoStatus = responseData; 
        } else {
            // Caso o formato seja inesperado
            novoStatus = "Formato de status inválido da API";
            console.error("Formato inesperado para status:", responseData);
        }

        // Use o status verificado ou a mensagem de formato inválido
        setStatusVerificado(novoStatus);
        
    } catch (e) {
        // ... (resto do tratamento de erro)
        console.error("Erro ao verificar status:", e);
        const msg = e.response && e.response.status === 404 
                    ? `Pedido ID ${pedidoConcluido} não encontrado (404).`
                    : "Não foi possível verificar o status do pedido.";
        setError(msg);
        setStatusVerificado(null);
    } finally {
        setLoadingStatus(false);
    }
};

  // Função genérica para buscar dados
  const buscarDados = async (tipo) => {
    if (tabelaVisivel === tipo) {
      setTabelaVisivel(null);
      return;
    }

    // Se começar a navegar pelo menu, limpa o status de último pedido concluído
    // Adicionei a limpeza do status verificado também
    if (ultimoPedidoDetalhes) {
        setUltimoPedidoDetalhes(null);
        setPedidoConcluido(null);
        setStatusVerificado(null); // Limpa o status
    }
    
    setLoading(true);
    setError(null);

    try {
        if (tipo === 'alimentos') {
          if (alimentos.length === 0) {
            const response = await obterAlimentosDoMenu();
            setAlimentos(response.alimentos); 
          }
        } else if (tipo === 'acompanhamentos') {
          if (acompanhamentos.length === 0) {
            const response = await obterAcompanhamentosDoMenu();
            setAcompanhamentos(response.acompanhamentos); 
          }
        }
        setTabelaVisivel(tipo);

    } catch (e) {
      console.error("Erro ao buscar dados:", e);
      setError("Não foi possível carregar os dados do menu.");
      setTabelaVisivel(null);
    } finally {
      setLoading(false);
    }
  };

// Lógica do carrinho de compras
  const gerenciarItem = (item, tipo, acao) => {
    const tipoItem = tipo.includes('Alimentos') ? 'Alimento' : 'Acompanhamento';
    const itemId = `${tipoItem}_${item.id}`; 
    
    // Garante que se um novo item for adicionado/removido, o último pedido finalizado seja limpo
    if (ultimoPedidoDetalhes !== null || pedidoConcluido !== null) {
        setUltimoPedidoDetalhes(null);
        setPedidoConcluido(null);
        setStatusVerificado(null);
    }

    setPedidoAtual(prevPedido => {
        const itemExistente = prevPedido.find(p => p.itemId === itemId);
        if (itemExistente) {
            let novaQuantidade;
            
            if (acao === 'ADICIONAR') {
                novaQuantidade = itemExistente.quantidade + 1;
            } else if (acao === 'SUBTRAIR') {
                novaQuantidade = itemExistente.quantidade - 1;
            } else {
                return prevPedido;
            }

            if (novaQuantidade > 0) {
                return prevPedido.map(p => 
                    p.itemId === itemId ? { ...p, quantidade: novaQuantidade } : p
                );
            } else {
                return prevPedido.filter(p => p.itemId !== itemId);
            }
        } else if (acao === 'ADICIONAR') {
            const novoItem = {
                itemId: itemId, 
                tipo: tipoItem, 
                id: item.id,
                nome: item.nome,
                valor: parseFloat(item.valor), 
                quantidade: 1, 
            };
            return [...prevPedido, novoItem];
        }

        return prevPedido; 
    });

    setError(null); 
  };
  // Chamada do backend para a finalização do pedido
  const finalizarPedido = async () => {    
    const idUsuarioString = localStorage.getItem('id_usuario_logado');
    const idUsuario = parseInt(idUsuarioString, 10);

    if (!idUsuario || isNaN(idUsuario)) { 
        setError("Usuário não autenticado ou ID inválido. Faça login novamente.");
        return; 
    }
    
    if (pedidoAtual.length === 0) {
        setError("O carrinho está vazio. Adicione itens antes de finalizar.");
        return;
    }
      
    setLoading(true);
    setError(null);
      
    try {
        const itensParaBackend = pedidoAtual.map(item => {
            const isAlimento = item.tipo === 'Alimento';
            
            return {
                id_alimento: isAlimento ? item.id : null,
                qtd_alimento: isAlimento ? item.quantidade : null,
                id_acompanhamento: !isAlimento ? item.id : null,
                qtd_acompanhamento: !isAlimento ? item.quantidade : null,
            };
        });

        const pedidoData = {
            id_usuario: idUsuario, 
            itens: itensParaBackend
        };
          
        const novoPedido = await criarPedidoCompleto(pedidoData);
        
        // Salva o resumo do pedido
        setUltimoPedidoDetalhes(pedidoAtual); 
        setPedidoConcluido(novoPedido.id); 
        setPedidoAtual([]); // Limpa o carrinho
        setStatusVerificado("Pedido enviado! Verifique o status.");
        setTabelaVisivel(null); 
        setError(null); 
          
    } catch (e) {
        console.error("Erro ao finalizar pedido:", e);
        const msg = e.response && e.response.data && e.response.data.erro
                    ? e.response.data.erro 
                    : "Falha ao criar pedido. Verifique o console para mais detalhes.";
        setError(msg);
        setPedidoConcluido(null); 
    } finally {
        setLoading(false);
    }
  }

  // LÓGICA DE EXIBIÇÃO (Decide o que mostrar: Carrinho ou Último Pedido)
  const pedidoParaExibir = pedidoAtual.length > 0 ? pedidoAtual : ultimoPedidoDetalhes;
  const resumoVisivel = pedidoAtual.length > 0 || ultimoPedidoDetalhes !== null;

  const valorTotalExibir = pedidoParaExibir 
    ? pedidoParaExibir.reduce((acc, item) => acc + (item.valor * item.quantidade), 0)
    : 0;
  const quantidadeTotalItensExibir = pedidoParaExibir 
    ? pedidoParaExibir.reduce((acc, item) => acc + item.quantidade, 0) 
    : 0;
    
  // Determina quais dados e tipo de título exibir
  const dadosExibidos = 
    tabelaVisivel === 'alimentos' ? alimentos :
    tabelaVisivel === 'acompanhamentos' ? acompanhamentos :
    [];

  const tipoExibido = 
    tabelaVisivel === 'alimentos' ? 'Alimentos Principais' :
    tabelaVisivel === 'acompanhamentos' ? 'Acompanhamentos' :
    null;

  
  // Função auxiliar para determinar a cor do status
  const corStatus = (status) => {
    if (!status) return 'text.secondary';
    if (status.includes('Pronto') || status.includes('Entregue')) return 'success.main';
    if (status.includes('Em Produção') || status.includes('Verifique') || status.includes('Montagem')) return 'warning.main';
    if (status.includes('Cancelado')) return 'error.main';
    return 'primary.main';
  }

  return (
    <Box
      sx={{ 
        minHeight: '100vh', 
        width: '100%',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        padding: 4,
        backgroundColor: '#f5f5f5' 
      }}
    >
      <Typography variant="h3" gutterBottom sx={{ color: '#1976d2', mt: 2 }}>
        Área de Pedidos
      </Typography>
      <Typography variant="h6" color="text.secondary" mb={4}>
        Selecione o que deseja visualizar e finalize o pedido.
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mb={4}>
          
          {/* Botão de Finalizar Pedido */}
          <Button
              variant="contained"
              size="large"
              color="secondary"
              disabled={pedidoAtual.length === 0 || loading || pedidoConcluido !== null}
              onClick={finalizarPedido}
              startIcon={<CheckCircleOutlineIcon />}
          >
              {loading ? <CircularProgress size={24} color="inherit" /> : `FINALIZAR PEDIDO (R$ ${valorTotalExibir.toFixed(2)})`}
          </Button>

          {/* Verificar Status */}
          {pedidoConcluido && (
              <Button
                  variant="outlined"
                  size="large"
                  color="warning"
                  onClick={verificarStatus}
                  disabled={loadingStatus}
                  startIcon={loadingStatus ? <CircularProgress size={20} color="inherit" /> : <AutorenewIcon />}
              >
                  VERIFICAR STATUS (ID: {pedidoConcluido})
              </Button>
          )}

          {pedidoConcluido && statusVerificado && statusVerificado.toUpperCase().includes("PENDENTE") && (
          <Button
              variant="contained"
              size="large"
              color="error"
              onClick={deletarPedido}
              disabled={loadingStatus}
              startIcon={loadingStatus ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ ml: 2 }}
          >
              DELETAR PEDIDO (ID: {pedidoConcluido})
          </Button>
      )}

          
      </Stack>

      {/* Stack de Botões de visualização */}
      <Stack direction="row" spacing={3} mb={4}>
        <Button
          variant="contained"
          size="large"
          onClick={() => buscarDados('alimentos')}
          color={tabelaVisivel === 'alimentos' ? "secondary" : "primary"}
          disabled={loading}
        >
          {loading && tabelaVisivel !== 'acompanhamentos' ? <CircularProgress size={24} color="inherit" /> : 
           (tabelaVisivel === 'alimentos' ? 'Ocultar Alimentos' : 'Exibir Alimentos')}
        </Button>
        
        <Button
          variant="contained"
          size="large"
          onClick={() => buscarDados('acompanhamentos')}
          color={tabelaVisivel === 'acompanhamentos' ? "secondary" : "primary"}
          disabled={loading}
        >
          {loading && tabelaVisivel !== 'alimentos' ? <CircularProgress size={24} color="inherit" /> : 
          (tabelaVisivel === 'acompanhamentos' ? 'Ocultar Acompanhamentos' : 'Exibir Acompanhamentos')}
        </Button>
      </Stack>

      {/* Exibição de Erro */}
      {error && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: 800, mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Renderização da Tabela do Menu */}
      {tabelaVisivel && dadosExibidos.length > 0 && (
        <Box 
          sx={{ 
              width: '100%', 
              maxWidth: 1000, 
              mt: 3,
              marginLeft: 'auto',
              marginRight: 'auto',
          }}
        >
          <Lista 
            tipo={tipoExibido} 
            dados={dadosExibidos} 
            onGerenciarItem={gerenciarItem} 
            carrinho={pedidoAtual} 
          />
        </Box>
      )}

      {/* Exibir o resumo do Carrinho ou Último Pedido */}
      {resumoVisivel && pedidoParaExibir && (
          <Box 
            sx={{ 
                mt: 5, 
                width: '100%', 
                maxWidth: 1000,
                marginLeft: 'auto',
                marginRight: 'auto',
            }}
          >
              <Typography variant="h5" gutterBottom sx={{ color: '#333' }}>
                  Resumo Detalhado do Pedido
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" mb={2}>
                  Total de Itens: **{quantidadeTotalItensExibir}** | Valor Total: R$ {valorTotalExibir.toFixed(2)}
                  {pedidoConcluido && (
                    <span style={{ color: 'green', marginLeft: '10px', fontWeight: 'bold' }}> | ID do Pedido: {pedidoConcluido}</span>
                  )}
              </Typography>
              <TableContainer component={Paper} elevation={3}>
                  <Table size="small">
                      <TableHead>
                          <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                              <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Preço Unitário</TableCell>
                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Quantidade</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>{pedidoAtual.length > 0 ? 'Ações' : 'Status'}</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {pedidoParaExibir.map(item => (
                              <TableRow key={item.itemId}>
                                  <TableCell>{item.nome}</TableCell>
                                  <TableCell align="right">R$ {item.valor.toFixed(2)}</TableCell>
                                  <TableCell align="center">{item.quantidade}</TableCell>
                                  <TableCell align="right">R$ {(item.valor * item.quantidade).toFixed(2)}</TableCell>
                                  <TableCell align="center">
                                      {/* Mostra botões de ação APENAS se o carrinho estiver em montagem */}
                                      {pedidoAtual.length > 0 ? (
                                          <Stack direction="row" spacing={1} justifyContent="center">
                                              <Button size="small" variant="outlined" color="error" onClick={() => gerenciarItem(item, item.tipo === 'Alimento' ? 'Alimentos Principais' : 'Acompanhamentos', 'SUBTRAIR')}>-</Button>
                                              <Button size="small" variant="outlined" color="success" onClick={() => gerenciarItem(item, item.tipo === 'Alimento' ? 'Alimentos Principais' : 'Acompanhamentos', 'ADICIONAR')}>+</Button>
                                          </Stack>
                                      ) : (
                                          <Typography color={corStatus(statusVerificado)}>
                                            {statusVerificado || "Verifique o status"}
                                          </Typography>
                                      )}
                                  </TableCell>
                              </TableRow>
                          ))}
                          {/* Linha de Total */}
                          <TableRow sx={{ '&:last-child td': { border: 0, fontWeight: 'bold' } }}>
                              <TableCell colSpan={3} align="right">TOTAL DO PEDIDO:</TableCell>
                              <TableCell align="right">R$ {valorTotalExibir.toFixed(2)}</TableCell>
                              <TableCell></TableCell>
                          </TableRow>
                      </TableBody>
                  </Table>
              </TableContainer>
              
              {/* Botão de Limpar Resumo, visível se há resumo para limpar */}
              {(pedidoConcluido || ultimoPedidoDetalhes) && (
                  <Button 
                      variant="outlined" 
                      color="primary" 
                      onClick={() => {
                          setPedidoAtual([]);
                          setUltimoPedidoDetalhes(null);
                          setPedidoConcluido(null);
                          setStatusVerificado(null); 
                      }}
                      sx={{ mt: 2 }}
                  >
                      Limpar carrinho
                  </Button>
              )}
          </Box>
      )}

      {/* Mensagens de Estado (apenas para tela vazia) */}
      {!resumoVisivel && !tabelaVisivel && !loading && !error && (
        <Typography variant="body1" sx={{ mt: 5, color: 'gray' }}>
          Clique em um botão para carregar o menu e adicione itens ao pedido.
        </Typography>
      )}

      
      {loading && <CircularProgress sx={{ mt: 5 }} />}
      
    </Box>
  );
}