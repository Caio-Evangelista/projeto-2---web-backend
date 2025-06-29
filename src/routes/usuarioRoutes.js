/**
 * Rotas de usuários
 */
const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const usuarioController = new UsuarioController();
const Validator = require('../middleware/validator');
const AuthMiddleware = require('../middleware/auth');

// Middleware de autenticação para todas as rotas
router.use(AuthMiddleware.verificarAutenticacao);

// Buscar usuário por ID
router.get('/:id', 
    (req, res, next) => usuarioController.buscarPorId(req, res, next)
);

// Atualizar usuário
router.put('/:id', 
    (req, res, next) => usuarioController.atualizar(req, res, next)
);

// Alterar senha
router.post('/:id/alterar-senha',
    Validator.validarCampos(['senhaAtual', 'novaSenha']),
    (req, res, next) => usuarioController.alterarSenha(req, res, next)
);

module.exports = router;
