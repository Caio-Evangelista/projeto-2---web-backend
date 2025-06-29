/**
 * Controlador de autenticação
 * Responsável por gerenciar as requisições relacionadas à autenticação
 */
class AuthController {
    /**
     * Cria uma nova instância do controlador de autenticação
     */
    constructor() {
        this.AuthService = require('../models/services/AuthService');
        this.authService = new this.AuthService();
        this.ResponseFormatter = require('../views/ResponseFormatter');
        this.Logger = require('../utils/Logger');
        this.logger = new this.Logger();
    }

    /**
     * Registra um novo usuário
     * @param {object} req - Objeto de requisição
     * @param {object} res - Objeto de resposta
     * @param {function} next - Função para continuar o fluxo
     */
    async registrar(req, res, next) {
        try {
            const { nome, email, senha } = req.body;
            
            // Validação de campos obrigatórios
            if (!nome || !email || !senha) {
                const resposta = this.ResponseFormatter.erroValidacao('Campos obrigatórios não fornecidos');
                return res.status(resposta.statusCode).json(resposta.body);
            }
            
            // Registra o usuário
            const usuario = await this.authService.registrar({ nome, email, senha });
            
            // Formata a resposta de sucesso
            const resposta = this.ResponseFormatter.sucesso('Usuário registrado com sucesso', usuario, 201);
            res.status(resposta.statusCode).json(resposta.body);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Autentica um usuário
     * @param {object} req - Objeto de requisição
     * @param {object} res - Objeto de resposta
     * @param {function} next - Função para continuar o fluxo
     */
    async login(req, res, next) {
        try {
            const { email, senha } = req.body;
            
            // Validação de campos obrigatórios
            if (!email || !senha) {
                const resposta = this.ResponseFormatter.erroValidacao('Campos obrigatórios não fornecidos');
                return res.status(resposta.statusCode).json(resposta.body);
            }
            
            // Autentica o usuário
            const usuario = await this.authService.autenticar(email, senha);
            
            // Armazena o usuário na sessão
            req.session.usuario = usuario;
            
            // Formata a resposta de sucesso
            const resposta = this.ResponseFormatter.sucesso('Login realizado com sucesso', usuario);
            res.status(resposta.statusCode).json(resposta.body);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Encerra a sessão do usuário
     * @param {object} req - Objeto de requisição
     * @param {object} res - Objeto de resposta
     */
    logout(req, res) {
        // Destrói a sessão
        req.session.destroy(err => {
            if (err) {
                this.logger.error(`Erro ao encerrar sessão: ${err.message}`);
                const resposta = this.ResponseFormatter.erro('Erro ao encerrar sessão');
                return res.status(resposta.statusCode).json(resposta.body);
            }
            
            // Formata a resposta de sucesso
            const resposta = this.ResponseFormatter.sucesso('Logout realizado com sucesso');
            res.status(resposta.statusCode).json(resposta.body);
        });
    }

    /**
     * Retorna o perfil do usuário autenticado
     * @param {object} req - Objeto de requisição
     * @param {object} res - Objeto de resposta
     */
    perfil(req, res) {
        // Formata a resposta de sucesso
        const resposta = this.ResponseFormatter.sucesso('Perfil do usuário', req.session.usuario);
        res.status(resposta.statusCode).json(resposta.body);
    }
}

module.exports = AuthController;
