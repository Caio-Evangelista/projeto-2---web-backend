/**
 * Controlador de eventos
 * Responsável por gerenciar as requisições relacionadas a eventos
 */
class EventoController {
	/**
	 * Cria uma nova instância do controlador de eventos
	 */
	constructor() {
		this.EventoRepository = require("../models/repositories/EventoRepository");
		this.eventoRepository = new this.EventoRepository();
		this.ResponseFormatter = require("../views/ResponseFormatter");
		this.Logger = require("../utils/Logger");
		this.logger = new this.Logger();
	}

	/**
	 * Cria um novo evento
	 * @param {object} req - Objeto de requisição
	 * @param {object} res - Objeto de resposta
	 * @param {function} next - Função para continuar o fluxo
	 */
	async criar(req, res, next) {
		try {
			const dados = req.body;

			// Cria o evento
			const evento = await this.eventoRepository.criar(dados);

			// Formata a resposta de sucesso
			const resposta = this.ResponseFormatter.sucesso(
				"Evento criado com sucesso",
				evento,
				201
			);
			res.status(resposta.statusCode).json(resposta.body);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Lista todos os eventos do usuário autenticado
	 * @param {object} req - Objeto de requisição
	 * @param {object} res - Objeto de resposta
	 * @param {function} next - Função para continuar o fluxo
	 */
	async listar(req, res, next) {
		try {
			// Busca os eventos do usuário autenticado
			const eventos = await this.eventoRepository.buscar();

			// Formata a resposta de sucesso
			const resposta = this.ResponseFormatter.sucesso(
				"Eventos encontrados",
				eventos
			);
			res.status(resposta.statusCode).json(resposta.body);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Busca um evento pelo ID
	 * @param {object} req - Objeto de requisição
	 * @param {object} res - Objeto de resposta
	 * @param {function} next - Função para continuar o fluxo
	 */
	async buscarPorId(req, res, next) {
		try {
			const { id } = req.params;

			// Busca o evento pelo ID
			const evento = await this.eventoRepository.buscarPorId(id);

			// Verifica se o evento existe
			if (!evento) {
				const resposta = this.ResponseFormatter.erroNaoEncontrado(
					"Evento não encontrado"
				);
				return res.status(resposta.statusCode).json(resposta.body);
			}

			// Formata a resposta de sucesso
			const resposta = this.ResponseFormatter.sucesso(
				"Evento encontrado",
				evento
			);
			res.status(resposta.statusCode).json(resposta.body);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Busca eventos por data
	 * @param {object} req - Objeto de requisição
	 * @param {object} res - Objeto de resposta
	 * @param {function} next - Função para continuar o fluxo
	 */
	async buscarPorData(req, res, next) {
		try {
			const { data } = req.params;

			// Busca os eventos pela data
			const eventos = await this.eventoRepository.buscarPorData(data);

			// Formata a resposta de sucesso
			const resposta = this.ResponseFormatter.sucesso(
				"Eventos encontrados",
				eventos
			);
			res.status(resposta.statusCode).json(resposta.body);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Busca eventos por intervalo de datas
	 * @param {object} req - Objeto de requisição
	 * @param {object} res - Objeto de resposta
	 * @param {function} next - Função para continuar o fluxo
	 */
	async buscarPorIntervalo(req, res, next) {
		try {
			const { dataInicio, dataFim } = req.query;

			// Validação de parâmetros
			if (!dataInicio || !dataFim) {
				const resposta = this.ResponseFormatter.erroValidacao(
					"Parâmetros dataInicio e dataFim são obrigatórios"
				);
				return res.status(resposta.statusCode).json(resposta.body);
			}

			// Busca os eventos pelo intervalo de datas
			const eventos = await this.eventoRepository.buscarPorIntervalo(
				dataInicio,
				dataFim
			);

			// Formata a resposta de sucesso
			const resposta = this.ResponseFormatter.sucesso(
				"Eventos encontrados",
				eventos
			);
			res.status(resposta.statusCode).json(resposta.body);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Atualiza um evento
	 * @param {object} req - Objeto de requisição
	 * @param {object} res - Objeto de resposta
	 * @param {function} next - Função para continuar o fluxo
	 */
	async atualizar(req, res, next) {
		try {
			const { id } = req.params;
			const dados = req.body;

			// Busca o evento pelo ID
			const evento = await this.eventoRepository.buscarPorId(id);

			// Verifica se o evento existe
			if (!evento) {
				const resposta = this.ResponseFormatter.erroNaoEncontrado(
					"Evento não encontrado"
				);
				return res.status(resposta.statusCode).json(resposta.body);
			}

			// Atualiza o evento
			const eventoAtualizado = await this.eventoRepository.atualizar(
				id,
				dados
			);

			// Formata a resposta de sucesso
			const resposta = this.ResponseFormatter.sucesso(
				"Evento atualizado com sucesso",
				eventoAtualizado
			);
			res.status(resposta.statusCode).json(resposta.body);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Remove um evento
	 * @param {object} req - Objeto de requisição
	 * @param {object} res - Objeto de resposta
	 * @param {function} next - Função para continuar o fluxo
	 */
	async remover(req, res, next) {
		try {
			const { id } = req.params;

			// Busca o evento pelo ID
			const evento = await this.eventoRepository.buscarPorId(id);

			// Verifica se o evento existe
			if (!evento) {
				const resposta = this.ResponseFormatter.erroNaoEncontrado(
					"Evento não encontrado"
				);
				return res.status(resposta.statusCode).json(resposta.body);
			}

			// Remove o evento
			await this.eventoRepository.remover(id);

			// Formata a resposta de sucesso
			const resposta = this.ResponseFormatter.sucesso(
				"Evento removido com sucesso"
			);
			res.status(resposta.statusCode).json(resposta.body);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = EventoController;
