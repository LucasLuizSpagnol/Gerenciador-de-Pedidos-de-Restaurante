import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, Typography, Button, CircularProgress, Alert, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper 
} from '@mui/material';

import { obterTodosPedidos, atualizarStatusPedido } from '../Services/Api'; 

// Componente principal para a tela do funcionário
export default function GerenciamentoPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Mapeamento de cor e texto do status
    const getStatusInfo = (status) => {
        switch (status) {
        case 'Pendente': return { label: 'Iniciar Pedido', color: 'primary' };
        case 'Em Producao': return { label: 'Finalizar Pedido', color: 'secondary' };
        case 'Finalizado': return { label: 'Finalizado', color: 'success', disabled: true };
        default: return { label: 'Status Desconhecido', color: 'default', disabled: true };
        }
    };

    // Função para carregar os dados
    const buscarPedidos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Chama a nova função da API
            const data = await obterTodosPedidos();
            setPedidos(data);
        } catch (e) {
            console.error("Erro ao buscar pedidos:", e);
            setError("Não foi possível carregar a lista de pedidos.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        buscarPedidos();
    }, [buscarPedidos]);


    // Função que gerencia o clique no botão de status
    const mudarStatus = async (pedidoId, atualStatus) => {
        setLoading(true);
        setError(null);
        
        let novoStatus;

        if (atualStatus === 'Pendente') {
            novoStatus = 'Em Producao';
        } else if (atualStatus === 'Em Producao') {
            novoStatus = 'Finalizado';
        } else {
            setLoading(false);
            return;
        }

        try {
            // Atualiza o status no Backend
            const pedidoAtualizado = await atualizarStatusPedido(pedidoId, novoStatus);

            // Atualiza o estado local do React para refletir a mudança
            setPedidos(prevPedidos => 
                prevPedidos.map(p => 
                    p.id === pedidoId ? pedidoAtualizado : p
                )
            );
            
        } catch (e) {
            console.error("Erro ao atualizar status:", e);
            setError("Falha ao atualizar o status do pedido.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                🍽️ Gerenciamento de Pedidos
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={3}>
                Ciclo de Produção
            </Typography>

            <Button onClick={buscarPedidos} variant="outlined" sx={{ mb: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={20} /> : 'Recarregar Pedidos'}
            </Button>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            {loading && pedidos.length === 0 ? (
                <CircularProgress sx={{ mt: 5 }} />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                                <TableCell># ID</TableCell>
                                <TableCell>Usuário (ID)</TableCell>
                                <TableCell>Data</TableCell>
                                <TableCell>Valor Total</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Ação</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pedidos.length === 0 ? (
                                <TableRow><TableCell colSpan={6} align="center">Nenhum pedido encontrado.</TableCell></TableRow>
                            ) : (
                                pedidos.map((pedido) => {
                                    const statusInfo = getStatusInfo(pedido.status);
                                    
                                    return (
                                        <TableRow key={pedido.id} hover>
                                            <TableCell>**{pedido.id}**</TableCell>
                                            <TableCell>{pedido.id_usuario}</TableCell>
                                            <TableCell>{new Date(pedido.data_pedido).toLocaleString()}</TableCell>
                                            <TableCell>R$ {parseFloat(pedido.valor_total).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Typography color={statusInfo.color}>{pedido.status}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    color={statusInfo.color}
                                                    disabled={statusInfo.disabled || loading}
                                                    onClick={() => mudarStatus(pedido.id, pedido.status)}
                                                >
                                                    {statusInfo.label}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}