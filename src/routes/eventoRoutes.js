/**
 * Rotas de eventos
 */
const express = require('express');
const router = express.Router();
const EventoController = require('../controllers/EventoController');
const eventoController = new EventoController();
const Validator = require('../middleware/validator');
const AuthMiddleware = require('../middleware/auth');

// Middleware de autenticação para todas as rotas
router.use(AuthMiddleware.verificarAutenticacao);

// Criar novo evento
router.post('/', 
    Validator.validarCampos(['titulo', 'dataInicio']),
    (req, res, next) => eventoController.criar(req, res, next)
);

// Listar todos os eventos do usuário
router.get('/', 
    (req, res, next) => eventoController.listar(req, res, next)
);

// Buscar evento por ID
router.get('/:id', 
    (req, res, next) => eventoController.buscarPorId(req, res, next)
);

// Buscar eventos por data
router.get('/data/:data', 
    (req, res, next) => eventoController.buscarPorData(req, res, next)
);

// Buscar eventos por intervalo de datas
router.get('/intervalo', 
    (req, res, next) => eventoController.buscarPorIntervalo(req, res, next)
);

// Atualizar evento
router.put('/:id', 
    (req, res, next) => eventoController.atualizar(req, res, next)
);

// Remover evento
router.delete('/:id', 
    (req, res, next) => eventoController.remover(req, res, next)
);

module.exports = router;
