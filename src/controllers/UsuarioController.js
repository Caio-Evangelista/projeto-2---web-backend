/**
 * Controlador de usuários
 * Responsável por gerenciar as requisições relacionadas a usuários
 */
class UsuarioController {
	/**
	 * Cria uma nova instância do controlador de usuários
	 */
	constructor() {
		this.UsuarioRepository = require("../models/repositories/UsuarioRepository");
		this.usuarioRepository = new this.UsuarioRepository();
		this.ResponseFormatter = require("../views/ResponseFormatter");
		this.Logger = require("../utils/Logger");
		this.logger = new this.Logger();
	}

	/**
	 * Busca um usuário pelo ID
	 * @param {object} req - Objeto de requisição
	 * @param {object} res - Objeto de resposta
	 * @param {function} next - Função para continuar o fluxo
	 */
	async buscarPorId(req, res, next) {
		try {
			const { id } = req.params;

			// Verifica se o usuário está buscando seu próprio perfil
			if (id !== req.session.usuario._id.toString()) {
				const resposta = this.ResponseFormatter.erroPermissao(
					"Você não tem permissão para acessar este perfil"
				);
				return res.status(resposta.statusCode).json(resposta.body);
			}

			// Busca o usuário pelo ID
			const usuario = await this.usuarioRepository.buscarPorId(id);

			// Verifica se o usuário existe
			if (!usuario) {
				const resposta = this.ResponseFormatter.erroNaoEncontrado(
					"Usuário não encontrado"
				);
				return res.status(resposta.statusCode).json(resposta.body);
			}

			// Remove a senha do objeto retornado
			const { senha, ...usuarioSemSenha } = usuario;

			// Formata a resposta de sucesso
			const resposta = this.ResponseFormatter.sucesso(
				"Usuário encontrado",
				usuarioSemSenha
			);
			res.status(resposta.statusCode).json(resposta.body);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Atualiza um usuário pelo ID
	 * @param {object} req - Objeto de requisição
	 * @param {object} res - Objeto de resposta
	 * @param {function} next - Função para continuar o fluxo
	 */
	async atualizar(req, res, next) {
		try {
			const { id } = req.params;
			const dados = req.body;

			// Verifica se o usuário está atualizando seu próprio perfil
			if (id !== req.session.usuario._id.toString()) {
				const resposta = this.ResponseFormatter.erroPermissao(
					"Você não tem permissão para atualizar este perfil"
				);
				return res.status(resposta.statusCode).json(resposta.body);
			}

			// Remove a senha do objeto de dados (a senha deve ser alterada por uma rota específica)
			if (dados.senha) {
				delete dados.senha;
			}

			// Atualiza o usuário
			const usuarioAtualizado = await this.usuarioRepository.atualizar(
				id,
				dados
			);

			// Verifica se o usuário existe
			if (!usuarioAtualizado) {
				const resposta = this.ResponseFormatter.erroNaoEncontrado(
					"Usuário não encontrado"
				);
				return res.status(resposta.statusCode).json(resposta.body);
			}

			// Atualiza a sessão com os novos dados
			req.session.usuario = usuarioAtualizado;

			// Formata a resposta de sucesso
			const resposta = this.ResponseFormatter.sucesso(
				"Usuário atualizado com sucesso",
				usuarioAtualizado
			);
			res.status(resposta.statusCode).json(resposta.body);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Altera a senha de um usuário
	 * @param {object} req - Objeto de requisição
	 * @param {object} res - Objeto de resposta
	 * @param {function} next - Função para continuar o fluxo
	 */
	async alterarSenha(req, res, next) {
		try {
			const { id } = req.params;
			const { senhaAtual, novaSenha } = req.body;

			// Validação de campos obrigatórios
			if (!senhaAtual || !novaSenha) {
				const resposta = this.ResponseFormatter.erroValidacao(
					"Campos obrigatórios não fornecidos"
				);
				return res.status(resposta.statusCode).json(resposta.body);
			}

			// Verifica se o usuário está alterando sua própria senha
			if (id !== req.session.usuario._id.toString()) {
				const resposta = this.ResponseFormatter.erroPermissao(
					"Você não tem permissão para alterar a senha deste usuário"
				);
				return res.status(resposta.statusCode).json(resposta.body);
			}

			// Busca o usuário pelo ID
			const usuario = await this.usuarioRepository.buscarPorId(id);

			// Verifica se o usuário existe
			if (!usuario) {
				const resposta = this.ResponseFormatter.erroNaoEncontrado(
					"Usuário não encontrado"
				);
				return res.status(resposta.statusCode).json(resposta.body);
			}

			// Verifica se a senha atual está correta
			if (senhaAtual != usuario.senha) {
				const resposta = this.ResponseFormatter.erro(
					"Senha atual incorreta",
					"INVALID_PASSWORD",
					400
				);
				return res.status(resposta.statusCode).json(resposta.body);
			}

			// Atualiza a senha
			await this.usuarioRepository.atualizar(id, { senha: novaSenha });

			// Formata a resposta de sucesso
			const resposta = this.ResponseFormatter.sucesso(
				"Senha alterada com sucesso"
			);
			res.status(resposta.statusCode).json(resposta.body);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = UsuarioController;
