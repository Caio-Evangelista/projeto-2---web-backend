/**
 * Classe base para repositórios
 * Implementa operações CRUD genéricas para qualquer coleção
 */
class BaseRepository {
    /**
     * Cria uma nova instância do repositório
     * @param {string} collectionName - Nome da coleção no MongoDB
     */
    constructor(collectionName) {
        this.Database = require('../../utils/Database');
        this.database = new this.Database();
        this.collectionName = collectionName;
        this.Logger = require('../../utils/Logger');
        this.logger = new this.Logger();
    }

    /**
     * Cria um novo documento na coleção
     * @param {object} dados - Dados a serem inseridos
     * @returns {Promise<object>} Documento criado
     */
    async criar(dados) {
        try {
            const db = await this.database.conectar();
            const collection = db.collection(this.collectionName);
            
            const resultado = await collection.insertOne(dados);
            
            if (resultado.acknowledged) {
                const documento = await collection.findOne({ _id: resultado.insertedId });
                this.logger.info(`Documento criado em ${this.collectionName}: ${resultado.insertedId}`);
                return documento;
            } else {
                throw new Error(`Erro ao criar documento em ${this.collectionName}`);
            }
        } catch (erro) {
            this.logger.error(`Erro ao criar documento em ${this.collectionName}: ${erro.message}`);
            throw erro;
        }
    }

    /**
     * Busca um documento pelo ID
     * @param {string} id - ID do documento
     * @returns {Promise<object|null>} Documento encontrado ou null
     */
    async buscarPorId(id) {
        try {
            const db = await this.database.conectar();
            const collection = db.collection(this.collectionName);
            
            const objectId = this.database.objectId(id);
            const documento = await collection.findOne({ _id: objectId });
            
            if (documento) {
                this.logger.info(`Documento encontrado em ${this.collectionName}: ${id}`);
            } else {
                this.logger.warning(`Documento não encontrado em ${this.collectionName}: ${id}`);
            }
            
            return documento;
        } catch (erro) {
            this.logger.error(`Erro ao buscar documento em ${this.collectionName}: ${erro.message}`);
            throw erro;
        }
    }

    /**
     * Busca documentos com base em um filtro
     * @param {object} filtro - Filtro de busca
     * @returns {Promise<Array<object>>} Lista de documentos encontrados
     */
    async buscar(filtro = {}) {
        try {
            const db = await this.database.conectar();
            const collection = db.collection(this.collectionName);
            
            const documentos = await collection.find(filtro).toArray();
            
            this.logger.info(`${documentos.length} documentos encontrados em ${this.collectionName}`);
            
            return documentos;
        } catch (erro) {
            this.logger.error(`Erro ao buscar documentos em ${this.collectionName}: ${erro.message}`);
            throw erro;
        }
    }

    /**
     * Atualiza um documento pelo ID
     * @param {string} id - ID do documento
     * @param {object} dados - Dados a serem atualizados
     * @returns {Promise<object|null>} Documento atualizado ou null
     */
    async atualizar(id, dados) {
        try {
            const db = await this.database.conectar();
            const collection = db.collection(this.collectionName);
            
            const objectId = this.database.objectId(id);
            
            const resultado = await collection.updateOne(
                { _id: objectId },
                { $set: dados }
            );
            
            if (resultado.matchedCount > 0) {
                const documentoAtualizado = await collection.findOne({ _id: objectId });
                this.logger.info(`Documento atualizado em ${this.collectionName}: ${id}`);
                return documentoAtualizado;
            } else {
                this.logger.warning(`Documento não encontrado para atualização em ${this.collectionName}: ${id}`);
                return null;
            }
        } catch (erro) {
            this.logger.error(`Erro ao atualizar documento em ${this.collectionName}: ${erro.message}`);
            throw erro;
        }
    }

    /**
     * Remove um documento pelo ID
     * @param {string} id - ID do documento
     * @returns {Promise<boolean>} true se removido, false se não encontrado
     */
    async remover(id) {
        try {
            const db = await this.database.conectar();
            const collection = db.collection(this.collectionName);
            
            const objectId = this.database.objectId(id);
            
            const resultado = await collection.deleteOne({ _id: objectId });
            
            if (resultado.deletedCount > 0) {
                this.logger.info(`Documento removido de ${this.collectionName}: ${id}`);
                return true;
            } else {
                this.logger.warning(`Documento não encontrado para remoção em ${this.collectionName}: ${id}`);
                return false;
            }
        } catch (erro) {
            this.logger.error(`Erro ao remover documento de ${this.collectionName}: ${erro.message}`);
            throw erro;
        }
    }
}

module.exports = BaseRepository;
