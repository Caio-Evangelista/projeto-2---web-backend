/**
 * Repositório para operações com Categorias
 */
class CategoriaRepository extends require('./BaseRepository') {
    /**
     * Cria uma nova instância do repositório de categorias
     */
    constructor() {
        super('categorias');
        this.Categoria = require('../domain/Categoria');
    }

    /**
     * Cria uma nova categoria
     * @param {object} dados - Dados da categoria
     * @returns {Promise<object>} Categoria criada
     */
    async criar(dados) {
        // Cria uma instância do modelo para validação
        const categoria = new this.Categoria(dados);
        const validacao = categoria.validar();
        
        if (!validacao.valido) {
            throw new Error(`Erro de validação: ${validacao.erros.join(', ')}`);
        }
        
        // Adiciona timestamps
        dados.dataCriacao = new Date();
        dados.dataAtualizacao = new Date();
        
        return super.criar(dados);
    }

    /**
     * Atualiza uma categoria existente
     * @param {string} id - ID da categoria
     * @param {object} dados - Dados a serem atualizados
     * @returns {Promise<object|null>} Categoria atualizada ou null
     */
    async atualizar(id, dados) {
        // Busca a categoria atual para validação
        const categoriaAtual = await this.buscarPorId(id);
        
        if (!categoriaAtual) {
            return null;
        }
        
        // Cria uma instância do modelo com os dados atualizados para validação
        const categoriaAtualizada = new this.Categoria({
            ...categoriaAtual,
            ...dados
        });
        
        const validacao = categoriaAtualizada.validar();
        
        if (!validacao.valido) {
            throw new Error(`Erro de validação: ${validacao.erros.join(', ')}`);
        }
        
        // Atualiza o timestamp
        dados.dataAtualizacao = new Date();
        
        return super.atualizar(id, dados);
    }

    /**
     * Busca categorias por nome
     * @param {string} nome - Nome ou parte do nome para busca
     * @returns {Promise<Array<object>>} Lista de categorias
     */
    async buscarPorNome(nome) {
        try {
            const db = await this.database.conectar();
            const collection = db.collection(this.collectionName);
            
            const categorias = await collection.find({
                nome: { $regex: nome, $options: 'i' }
            }).toArray();
            
            this.logger.info(`${categorias.length} categorias encontradas pelo nome: ${nome}`);
            
            return categorias;
        } catch (erro) {
            this.logger.error(`Erro ao buscar categorias pelo nome: ${erro.message}`);
            throw erro;
        }
    }
}

module.exports = CategoriaRepository;
