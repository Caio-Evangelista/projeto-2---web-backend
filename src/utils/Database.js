/**
 * Classe para conexão com o MongoDB
 */
class Database {
    /**
     * Cria uma nova instância da classe Database
     */
    constructor() {
        this.config = require('../../config/database');
        this.MongoClient = require('mongodb').MongoClient;
        this.ObjectId = require('mongodb').ObjectId;
        this.Logger = require('./Logger');
        this.logger = new this.Logger();
        this.client = null;
    }

    /**
     * Conecta ao banco de dados MongoDB
     * @returns {Promise<object>} Instância do banco de dados
     */
    async conectar() {
        try {
            if (this.client && this.client.topology && this.client.topology.isConnected()) {
                return this.client.db(this.config.dbName);
            }

            this.client = await this.MongoClient.connect(this.config.url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            this.logger.info('Conexão com o MongoDB estabelecida');
            return this.client.db(this.config.dbName);
        } catch (erro) {
            this.logger.error(`Erro ao conectar ao MongoDB: ${erro.message}`);
            throw erro;
        }
    }

    /**
     * Fecha a conexão com o banco de dados
     * @returns {Promise<void>}
     */
    async fechar() {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.logger.info('Conexão com o MongoDB fechada');
        }
    }

    /**
     * Converte uma string para ObjectId do MongoDB
     * @param {string} id - ID a ser convertido
     * @returns {ObjectId} ObjectId do MongoDB
     */
    objectId(id) {
        try {
            return new this.ObjectId(id);
        } catch (erro) {
            this.logger.error(`Erro ao converter para ObjectId: ${erro.message}`);
            throw new Error(`ID inválido: ${id}`);
        }
    }
}

module.exports = Database;
