/**
 * Controlador de categorias
 * Responsável por gerenciar as requisições relacionadas a categorias
 */
class CategoriaController {
    /**
     * Cria uma nova instância do controlador de categorias
     */
    constructor() {
        this.CategoriaRepository = require('../models/repositories/CategoriaRepository');
        this.categoriaRepository = new this.CategoriaRepository();
        this.ResponseFormatter = require('../views/ResponseFormatter');
        this.Logger = require('../utils/Logger');
        this.logger = new this.Logger();
    }

    /**
     * Cria uma nova categoria
     * @param {object} req - Objeto de requisição
     * @param {object} res - Objeto de resposta
     * @param {function} next - Função para continuar o fluxo
     */
    async criar(req, res, next) {
        try {
            const dados = req.body;
            
            // Cria a categoria
            const categoria = await this.categoriaRepository.criar(dados);
            
            // Formata a resposta de sucesso
            const resposta = this.ResponseFormatter.sucesso('Categoria criada com sucesso', categoria, 201);
            res.status(resposta.statusCode).json(resposta.body);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lista todas as categorias
     * @param {object} req - Objeto de requisição
     * @param {object} res - Objeto de resposta
     * @param {function} next - Função para continuar o fluxo
     */
    async listar(req, res, next) {
        try {
            // Busca todas as categorias
            const categorias = await this.categoriaRepository.buscar();
            
            // Formata a resposta de sucesso
            const resposta = this.ResponseFormatter.sucesso('Categorias encontradas', categorias);
            res.status(resposta.statusCode).json(resposta.body);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Busca uma categoria pelo ID
     * @param {object} req - Objeto de requisição
     * @param {object} res - Objeto de resposta
     * @param {function} next - Função para continuar o fluxo
     */
    async buscarPorId(req, res, next) {
        try {
            const { id } = req.params;
            
            // Busca a categoria pelo ID
            const categoria = await this.categoriaRepository.buscarPorId(id);
            
            // Verifica se a categoria existe
            if (!categoria) {
                const resposta = this.ResponseFormatter.erroNaoEncontrado('Categoria não encontrada');
                return res.status(resposta.statusCode).json(resposta.body);
            }
            
            // Formata a resposta de sucesso
            const resposta = this.ResponseFormatter.sucesso('Categoria encontrada', categoria);
            res.status(resposta.statusCode).json(resposta.body);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Atualiza uma categoria
     * @param {object} req - Objeto de requisição
     * @param {object} res - Objeto de resposta
     * @param {function} next - Função para continuar o fluxo
     */
    async atualizar(req, res, next) {
        try {
            const { id } = req.params;
            const dados = req.body;
            
            // Atualiza a categoria
            const categoriaAtualizada = await this.categoriaRepository.atualizar(id, dados);
            
            // Verifica se a categoria existe
            if (!categoriaAtualizada) {
                const resposta = this.ResponseFormatter.erroNaoEncontrado('Categoria não encontrada');
                return res.status(resposta.statusCode).json(resposta.body);
            }
            
            // Formata a resposta de sucesso
            const resposta = this.ResponseFormatter.sucesso('Categoria atualizada com sucesso', categoriaAtualizada);
            res.status(resposta.statusCode).json(resposta.body);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Remove uma categoria
     * @param {object} req - Objeto de requisição
     * @param {object} res - Objeto de resposta
     * @param {function} next - Função para continuar o fluxo
     */
    async remover(req, res, next) {
        try {
            const { id } = req.params;
            
            // Remove a categoria
            const removido = await this.categoriaRepository.remover(id);
            
            // Verifica se a categoria existia
            if (!removido) {
                const resposta = this.ResponseFormatter.erroNaoEncontrado('Categoria não encontrada');
                return res.status(resposta.statusCode).json(resposta.body);
            }
            
            // Formata a resposta de sucesso
            const resposta = this.ResponseFormatter.sucesso('Categoria removida com sucesso');
            res.status(resposta.statusCode).json(resposta.body);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CategoriaController;
