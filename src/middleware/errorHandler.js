/**
 * Middleware de tratamento de erros
 * Responsável por capturar e tratar erros na aplicação
 */
class ErrorHandler {
    /**
     * Trata erros da aplicação
     * @param {Error} err - Objeto de erro
     * @param {object} req - Objeto de requisição
     * @param {object} res - Objeto de resposta
     * @param {function} next - Função para continuar o fluxo
     */
    static handleError(err, req, res, next) {
        const ResponseFormatter = require('../views/ResponseFormatter');
        const Logger = require('../utils/Logger');
        const logger = new Logger();
        
        // Registra o erro
        logger.error(`Erro: ${err.message}`);
        logger.error(err.stack);
        
        // Verifica o tipo de erro
        if (err.message.includes('validação')) {
            const resposta = ResponseFormatter.erroValidacao(err.message);
            return res.status(resposta.statusCode).json(resposta.body);
        }
        
        if (err.message.includes('Email já está em uso')) {
            const resposta = ResponseFormatter.erro(err.message, 'EMAIL_IN_USE', 409);
            return res.status(resposta.statusCode).json(resposta.body);
        }
        
        if (err.message.includes('Credenciais inválidas')) {
            const resposta = ResponseFormatter.erro(err.message, 'INVALID_CREDENTIALS', 401);
            return res.status(resposta.statusCode).json(resposta.body);
        }
        
        // Erro genérico
        const resposta = ResponseFormatter.erro('Erro interno do servidor');
        res.status(resposta.statusCode).json(resposta.body);
    }

    /**
     * Trata rotas não encontradas
     * @param {object} req - Objeto de requisição
     * @param {object} res - Objeto de resposta
     */
    static handleNotFound(req, res) {
        const ResponseFormatter = require('../views/ResponseFormatter');
        const resposta = ResponseFormatter.erroNaoEncontrado('Rota não encontrada');
        res.status(resposta.statusCode).json(resposta.body);
    }
}

module.exports = ErrorHandler;
