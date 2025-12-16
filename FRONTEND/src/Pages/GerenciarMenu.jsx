import React, { useState, useEffect, Fragment } from 'react';

import { 
    Box, Typography, Button, Stack, CircularProgress, Alert, 
    Tabs, Tab, 
    TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Switch
} from '@mui/material';

import { 
    obterAlimentosDoMenu, 
    obterAcompanhamentosDoMenu,
    criarAlimento, 
    atualizarAlimento, 
    deletarAlimento,
    criarAcompanhamento, 
    atualizarAcompanhamento, 
    deletarAcompanhamento,
    obterUsuarios, 
    criarUsuario, 
    atualizarUsuario, 
    deletarUsuario
} from '../Services/Api';

const GerenciarMenu = () => {
    const [tabIndex, setTabIndex] = useState(0); // 0: Alimentos, 1: Acompanhamentos
    const [alimentos, setAlimentos] = useState([]);
    const [acompanhamentos, setAcompanhamentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [filtroUsuario, setFiltroUsuario] = useState('todos');

    // Estados do Formulário
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({ 
        id: null, 
        nome: '', 
        valor: '', 
        descricao: '',
        login: '',     
        senha: '', 
        adm: false,
        funcionario: false,
    });
    
    const tipoAtual = tabIndex === 0 ? 'Alimento' : (tabIndex === 1 ? 'Acompanhamento' : 'Usuário');
    const listaAtual = tabIndex === 0 ? alimentos : (tabIndex === 1 ? acompanhamentos : usuarios); 
    const setListaAtual = tabIndex === 0 ? setAlimentos : (tabIndex === 1 ? setAcompanhamentos : setUsuarios);

    // Carregamento inicial dos dados
    useEffect(() => {
        carregarDados();
    // Recarrega quando a aba muda
    }, [tabIndex, filtroUsuario]); 

    // Função para carregar dados (Alimentos, Acompanhamentos, Usuários)
    const carregarDados = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            if (tabIndex === 0) {
                const response = await obterAlimentosDoMenu();
                setAlimentos(response.alimentos || []);
            }  else if (tabIndex === 1) { 
                const response = await obterAcompanhamentosDoMenu();
                setAcompanhamentos(response.acompanhamentos || []);
            } else { 
                // Usa a função com o filtro!
                const response = await obterUsuarios(filtroUsuario); 
                setUsuarios(response || []);
            }
        
        } catch (e) {
            console.error(`Erro ao carregar ${tipoAtual}:`, e);
            setError(`Não foi possível carregar o menu de ${tipoAtual}.`);
        } finally {
            setLoading(false);
        }
    };
    // Função que cria o formulário para usuários, alimentos, acompanhamentos
    const criarItem = () => {
        if (tabIndex === 2) {
            // Inicialização para usuário
            setFormData({ id: null, login: '', senha: '', adm: false, funcionario: false }); 
            // Inicialização para alimentos/acompanhamentos
        } else {
            setFormData({ id: null, nome: '', valor: '', descricao: '' }); 
        }
        setOpenModal(true);
    };

// Função para editar o item
const editarItem = (item) => {
    if (tabIndex === 2) {
        // Inicialização para edição de usuário
        setFormData({ 
            id: item.id, 
            login: item.login,
            senha: '',
            adm: item.adm || false,
            funcionario: item.funcionario || false,
        });
        // Inicialização para edição do alimento/acompanhamento
    } else {
        setFormData({ id: item.id, nome: item.nome, valor: item.valor, descricao: item.descricao || '' });
    }
    setOpenModal(true);
};

// Função para fechar o formulário
const fecharItem = () => {
    setOpenModal(false);
    setError(null);
    setSuccess(null);
};

// Função para entrada do formulário
const entradaItem = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Se o elemento for um Switch (checkbox), use 'checked' que é booleano.
    // Caso contrário, use 'value'.
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ 
        ...prev, 
        [name]: newValue 
    }));
};

// Função para salvar o Fómulário
const salvarItem = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null); 

    try {
        let dataToSend = {};
        let endpointCall = null;
        let isEditing = formData.id !== null;

        // Alimento ou acompanhamento
        if (tabIndex === 0 || tabIndex === 1) { 
            dataToSend = { 
                nome: formData.nome, 
                valor: parseFloat(formData.valor),
                descricao: formData.descricao 
            };
            
            // Validação de campos obrigatórios (Nome, Valor e Descrição)
            if (isNaN(dataToSend.valor) || !dataToSend.nome || !dataToSend.descricao) {
                 setLoading(false);
                 setError(`Preencha todos os campos (${tipoAtual}: Nome, Valor e Descrição) corretamente.`);
                 return;
            }

            if (tabIndex === 0) {
                endpointCall = isEditing ? atualizarAlimento(formData.id, dataToSend) : criarAlimento(dataToSend);
            } else { 
                endpointCall = isEditing ? atualizarAcompanhamento(formData.id, dataToSend) : criarAcompanhamento(dataToSend);
            }

        // Usuário
        } else if (tabIndex === 2) {
            dataToSend = { 
                login: formData.login, 
                adm: formData.adm, 
                funcionario: formData.funcionario,
            };
            
            // Validação de campos obrigatórios para Usuário: Apenas Login
            if (!dataToSend.login) {
                 setLoading(false);
                 setError("Preencha o Login do usuário.");
                 return;
            }

            // A senha é obrigatória apenas na criação
            if (!isEditing) {
                if (!formData.senha) {
                    setLoading(false);
                    setError("A senha é obrigatória na criação de um novo usuário.");
                    return;
                }
                dataToSend.senha = formData.senha;
                endpointCall = criarUsuario(dataToSend);
            } else {
                // Se a senha for preenchida ao editar, envie para alteração.
                if (formData.senha) {
                    dataToSend.senha = formData.senha;
                }
                endpointCall = atualizarUsuario(formData.id, dataToSend);
            }
        }
        
        let result = await endpointCall;
        
        
        // Atualização do Estado Local (Lista)
        setListaAtual(prevList => {
            if (isEditing) {
                // Se for usuário, remova o campo 'senha' antes de atualizar a lista local.
                const itemToUpdate = tabIndex === 2 ? { ...result, senha: '' } : result;
                return prevList.map(item => item.id === result.id ? itemToUpdate : item);
            } else {
                return [...prevList, result];
            }
        });

        if (tabIndex === 2) { 
            await carregarDados(); 
        }
        fecharItem();

    } catch (e) {
        console.error(`Erro ao salvar ${tipoAtual}:`, e);
        const msg = e.response?.data?.erro || `Falha ao salvar o ${tipoAtual}. Código: ${e.response?.status || 'N/A'}.`;
        setError(msg);

    } finally {
        setLoading(false);
    }
};

    // Função para deletar um item
    const deletarItem = async (id, nome) => {
        if (!window.confirm(`Tem certeza que deseja deletar o ${tipoAtual} "${nome}"?`)) {
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            if (tabIndex === 0) {
                await deletarAlimento(id);
            } else if (tabIndex === 1) { 
                await deletarAcompanhamento(id);
            } else {
                await deletarUsuario(id); 
            }
            
            // Restante da lógica de remoção da lista
            setListaAtual(prevList => prevList.filter(item => item.id !== id));
            setSuccess(`${tipoAtual} "${nome}" deletado com sucesso!`);

        } catch (e) {
            console.error(`Erro ao deletar ${tipoAtual}:`, e);
            const msg = e.response?.data?.erro || `Falha ao deletar o ${tipoAtual}, verifique se existem vínculos.`;
            setError(msg);
        } finally {
            setLoading(false);
        }
    };
// Função para renderizar a tabela
const renderizarTabela = () => {
    const isUserTab = tabIndex === 2;
    const colSpan = 4; 
    const tipoAtualMensagem = isUserTab ? "usuário" : tipoAtual;

    return (
        <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                        {isUserTab ? (
                            // Colunas para usuários
                            <Fragment key="thead-user">
                                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Login</TableCell> 
                                <TableCell sx={{ fontWeight: 'bold' }}>Perfil</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Senha</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                            </Fragment>
                        ) : (
                            // Colunas para alimento e acompanhamento
                            <Fragment key="thead-menu">
                                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Valor (R$)</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                            </Fragment>
                        )}
                    </TableRow>
                </TableHead>
                
                <TableBody>
                    {listaAtual.map(item => (
                        <TableRow key={item.id} hover>
                            {isUserTab ? (
                                <Fragment key={`user-row-cells-${item.id}`}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.login}</TableCell>
                                    
                                    <TableCell>
                                        {/* Lógica para exibir o Perfil */}
                                        {item.adm ? 
                                            <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>Administrador</Typography> 
                                            : 
                                            (item.funcionario ? 
                                                <Typography variant="body2" color="secondary">Funcionário</Typography> 
                                                : 
                                                <Typography variant="body2" color="text.secondary">Padrão</Typography>
                                            )
                                        }
                                    </TableCell>
                                    
                                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    
                                    </TableCell>
                                    
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Button size="small" variant="outlined" color="primary" onClick={() => editarItem(item)}>Editar</Button>
                                            <Button 
                                                size="small" 
                                                variant="outlined" 
                                                color="error" 
                                                onClick={() => deletarItem(item.id, item.login)}
                                            >Deletar</Button>
                                        </Stack>
                                    </TableCell>
                                </Fragment>
                            ) : (
                                <Fragment key={`menu-row-cells-${item.id}`}> 
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.nome}</TableCell>
                                    <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item.descricao}
                                    </TableCell>
                                    <TableCell align="right">
                                        R$ {parseFloat(item.valor).toFixed(2).replace('.', ',')}
                                    </TableCell>
                                    
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Button size="small" variant="outlined" color="primary" onClick={() => editarItem(item)}>Editar</Button>
                                            <Button 
                                                size="small" 
                                                variant="outlined" 
                                                color="error" 
                                                onClick={() => deletarItem(item.id, item.nome)}
                                            >Deletar</Button>
                                        </Stack>
                                    </TableCell>
                                </Fragment>
                            )}
                        </TableRow>
                    ))}
                    
                    {/* Mensagem de lista vazia */}
                    {listaAtual.length === 0 && !loading && (
                        <TableRow>
                            <TableCell colSpan={colSpan} align="center">
                                Nenhum {tipoAtualMensagem} cadastrado.
                            </TableCell> 
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
    return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: 'auto' }}>
        <Typography variant="h3" gutterBottom sx={{ color: '#1976d2', mb: 4 }}>
            Gerenciamento do Menu
        </Typography>

        {/* Abas: Agora inclui Usuários (tabIndex = 2) */}
        <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} sx={{ mb: 3 }}>
            <Tab label="Alimentos Principais" />
            <Tab label="Acompanhamentos" />
            <Tab label="Usuários" />
        </Tabs>

        {/* CONTROLE DE BOTÕES E FILTROS */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            
            {/* Botão de Criação */}
            <Button
                variant="contained"
                color="success"
                onClick={criarItem}
                disabled={loading}
            >
                {`+ Novo ${tipoAtual}`}
            </Button>

            {/* FILTROS APARECEM APENAS NA ABA DE USUÁRIOS (tabIndex === 2) */}
            {tabIndex === 2 && (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant={filtroUsuario === 'todos' ? "contained" : "outlined"}
                        color="primary"
                        size="small"
                        // Ao clicar, o estado 'filtroUsuario' muda, disparando o useEffect
                        onClick={() => setFiltroUsuario('todos')}
                        disabled={loading}
                    >
                        Todos
                    </Button>
                    <Button
                        variant={filtroUsuario === 'adm' ? "contained" : "outlined"}
                        color="primary"
                        size="small"
                        onClick={() => setFiltroUsuario('adm')}
                        disabled={loading}
                    >
                        ADM
                    </Button>
                    <Button
                        variant={filtroUsuario === 'funcionario' ? "contained" : "outlined"}
                        color="primary"
                        size="small"
                        onClick={() => setFiltroUsuario('funcionario')}
                        disabled={loading}
                    >
                        Funcionários
                    </Button>
                </Stack>
            )}
            
            {loading && <CircularProgress size={24} />}
            
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        {loading && listaAtual.length === 0 ? (
            <Stack alignItems="center" sx={{ mt: 5 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Carregando {tipoAtual}...</Typography>
            </Stack>
        ) : (
            // Chamada da função para renderizar a tabela
            renderizarTabela() 
        )}

        {/* Modal de Criação/Edição Adaptado para usuário*/}
        <Dialog open={openModal} onClose={fecharItem}>
            <DialogTitle>{formData.id ? `Editar ${tipoAtual}` : `Criar Novo ${tipoAtual}`}</DialogTitle>
            
            <DialogContent>
                {tabIndex === 2 ? (
                    <>
                        {/* Campo LOGIN (Substitui Nome/Email) */}
                        <TextField
                            autoFocus
                            margin="dense"
                            name="login"
                            label="Login"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formData.login || ''}
                            onChange={entradaItem}
                            sx={{ mt: 1 }}
                        />
                        {/* Campo Senha */}
                        <TextField
                            margin="dense"
                            name="senha"
                            // Mensagem adaptada se for edição
                            label={formData.id ? "Nova Senha (Deixe vazio para não alterar)" : "Senha"}
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={formData.senha}
                            onChange={entradaItem}
                        />
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2, mb: 1 }}>
                            <Typography>Administrador (ADM)</Typography>
                            <Switch
                                name="adm"
                                checked={formData.adm}
                                onChange={entradaItem}
                                inputProps={{ 'aria-label': 'Admin switch' }}
                            />
                        </Stack>

                        {/* Switch para Funcionário */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Typography>Funcionário</Typography>
                            <Switch
                                name="funcionario"
                                checked={formData.funcionario}
                                onChange={entradaItem}
                                inputProps={{ 'aria-label': 'Funcionario switch' }}
                            />
                        </Stack>
                    </>
                ) : (
                    <>
                        {/* Campo Nome (Mantido para Menu) */}
                        <TextField
                            autoFocus
                            margin="dense"
                            name="nome"
                            label="Nome"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formData.nome}
                            onChange={entradaItem}
                            sx={{ mt: 1 }}
                        />
                        {/* Campo Valor */}
                        <TextField
                            margin="dense"
                            name="valor"
                            label="Valor (R$)"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={formData.valor}
                            onChange={entradaItem}
                        />
                        {/* Campo Descrição */}
                        <TextField
                            margin="dense"
                            name="descricao"
                            label="Descrição"
                            type="text"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={formData.descricao}
                            onChange={entradaItem}
                        />
                    </>
                )}
                
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </DialogContent>

            <DialogActions>
                <Button onClick={fecharItem} color="error" variant="outlined">Cancelar</Button>
                
                <Button 
                    onClick={salvarItem} 
                    color="success" 
                    variant="contained" 
                    disabled={loading || 
                        (tabIndex === 2 && (!formData.login || (!formData.id && !formData.senha))) ||
                        ((tabIndex === 0 || tabIndex === 1) && (!formData.nome || !formData.valor || !formData.descricao))
                    }
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Salvar'}
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
);
};

export default GerenciarMenu;