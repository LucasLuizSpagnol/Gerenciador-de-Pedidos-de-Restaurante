const express = require("express");
const sequelize = require('./Config/Conection');
const cors = require('cors'); 
// ...


const usuarioRouter = require("./Controller/Usuario_controller");
const alimentoRouter = require("./Controller/Alimento_controller");
const pedidoRouter = require("./Controller/Pedido_controller");
const acompanhamentoRouter = require("./Controller/Acompanhamento_controller");

const corsOptions = {
    origin: 'http://localhost:5173', // ✅ Permite apenas requisições do seu frontend (Vite)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Se você precisar de cookies/sessões
    optionsSuccessStatus: 204
};

const app = express();
app.use(express.json());
app.use(cors());

sequelize.sync({ alter: true }) // <--- ESSA LINHA É ESSENCIAL!
    .then(() => {
        console.log('📝 Modelos sincronizados com o banco de dados.');
        // Iniciar o servidor Express SÓ DEPOIS que a sincronização terminar.
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Erro na sincronização do banco de dados:', err);
    });

const PORT = 3002;


// Usar o router de alunos
app.use("/usuario", usuarioRouter);

// Usar o router de cursos
app.use("/alimento", alimentoRouter);

// Usar o router de matrículas
app.use("/pedido", pedidoRouter);

// Usar o router de matrículas
app.use("/acompanhamento", acompanhamentoRouter);


