/**
 * Rotas de autenticação
 */
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authController = new AuthController();
const Validator = require('../middleware/validator');
const AuthMiddleware = require('../middleware/auth');

// Registro de novo usuário
router.post('/registrar', 
    Validator.validarCampos(['nome', 'email', 'senha']),
    (req, res, next) => authController.registrar(req, res, next)
);

// Login de usuário
router.post('/login', 
    Validator.validarCampos(['email', 'senha']),
    (req, res, next) => authController.login(req, res, next)
);

// Logout de usuário
router.post('/logout', 
    AuthMiddleware.verificarAutenticacao,
    (req, res) => authController.logout(req, res)
);

// Perfil do usuário autenticado
router.get('/perfil', 
    AuthMiddleware.verificarAutenticacao,
    (req, res) => authController.perfil(req, res)
);

module.exports = router;
