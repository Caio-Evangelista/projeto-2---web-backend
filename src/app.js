/**
 * Configuração da aplicação Express
 */
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const authConfig = require('../config/auth');
const dbConfig = require('../config/database');

// Importação de rotas
const authRoutes = require('./routes/authRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

// Importação de middleware
const ErrorHandler = require('./middleware/errorHandler');

// Criação da aplicação Express
const app = express();

// Configuração de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de sessão
app.use(session({
    secret: authConfig.session.secret,
    resave: authConfig.session.resave,
    saveUninitialized: authConfig.session.saveUninitialized,
    cookie: authConfig.session.cookie,
    store: MongoStore.create({
        mongoUrl: dbConfig.url,
        dbName: dbConfig.dbName,
        ttl: 24 * 60 * 60 // 1 dia
    })
}));

// Configuração de rotas
app.use('/api/auth', authRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Rota de status da API
app.get('/api/status', (req, res) => {
    const ResponseFormatter = require('./views/ResponseFormatter');
    const resposta = ResponseFormatter.sucesso('API da Agenda Eletrônica está funcionando', {
        timestamp: new Date(),
        versao: '2.0.0',
        arquitetura: 'MVC'
    });
    res.status(resposta.statusCode).json(resposta.body);
});

// Middleware para rotas não encontradas
app.use('*', ErrorHandler.handleNotFound);

// Middleware para tratamento de erros
app.use(ErrorHandler.handleError);

module.exports = app;
