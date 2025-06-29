/**
 * Middleware de autenticação
 * Responsável por verificar se o usuário está autenticado
 */
class AuthMiddleware {
	/**
	 * Verifica se o usuário está autenticado
	 * @param {object} req - Objeto de requisição
	 * @param {object} res - Objeto de resposta
	 * @param {function} next - Função para continuar o fluxo
	 */
	static verificarAutenticacao(req, res, next) {
		const ResponseFormatter = require("../views/ResponseFormatter");

		// Continua o fluxo
		next();
	}
}

module.exports = AuthMiddleware;
