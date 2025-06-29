/**
 * Rotas de categorias
 */
const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/CategoriaController');
const categoriaController = new CategoriaController();
const Validator = require('../middleware/validator');
const AuthMiddleware = require('../middleware/auth');

// Middleware de autenticação para todas as rotas
router.use(AuthMiddleware.verificarAutenticacao);

// Criar nova categoria
router.post('/', 
    Validator.validarCampos(['nome']),
    (req, res, next) => categoriaController.criar(req, res, next)
);

// Listar todas as categorias
router.get('/', 
    (req, res, next) => categoriaController.listar(req, res, next)
);

// Buscar categoria por ID
router.get('/:id', 
    (req, res, next) => categoriaController.buscarPorId(req, res, next)
);

// Atualizar categoria
router.put('/:id', 
    (req, res, next) => categoriaController.atualizar(req, res, next)
);

// Remover categoria
router.delete('/:id', 
    (req, res, next) => categoriaController.remover(req, res, next)
);

module.exports = router;
