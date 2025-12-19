import React from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, Stack, Typography, Box 
} from '@mui/material';

// O componente Lista recebe as props que o Principal está enviando
export default function Lista({ tipo, dados, onGerenciarItem, carrinho }) {

  return (
    <Box>
        <Typography variant="h5" gutterBottom sx={{ color: '#004d40', mb: 2 }}>
            Menu: {tipo}
        </Typography>
        <TableContainer component={Paper} elevation={3}>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#e8f5e9' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Valor (R$)</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>No Carrinho</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ação</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dados.map((item) => {
                        // Encontra a quantidade do item no carrinho (se existir)
                        const itemId = `${tipo.includes('Alimentos') ? 'Alimento' : 'Acompanhamento'}_${item.id}`;
                        const itemNoCarrinho = carrinho.find(p => p.itemId === itemId);
                        const quantidade = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;
                        
                        // Determina o nome do tipo para passar de volta ao handler
                        const tipoParaHandler = tipo.includes('Alimentos') ? 'Alimentos Principais' : 'Acompanhamentos';

                        return (
                            <TableRow key={item.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                                <TableCell>{item.nome}</TableCell>
                                <TableCell align="right">{parseFloat(item.valor).toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <Typography 
                                        color={quantidade > 0 ? 'success.main' : 'text.secondary'} 
                                        fontWeight={quantidade > 0 ? 'bold' : 'normal'}
                                    >
                                        {quantidade}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Button 
                                            size="small" 
                                            variant="outlined" 
                                            color="error" 
                                            disabled={quantidade === 0}
                                            onClick={() => onGerenciarItem(item, tipoParaHandler, 'SUBTRAIR')}
                                        >
                                            -
                                        </Button>
                                        <Button 
                                            size="small" 
                                            variant="contained" 
                                            color="success"
                                            onClick={() => onGerenciarItem(item, tipoParaHandler, 'ADICIONAR')}
                                        >
                                            +
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
  );
}