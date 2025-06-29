/**
 * Classe para registro de logs
 */
class Logger {
    /**
     * Cria uma nova instância da classe Logger
     */
    constructor() {
        this.fs = require('fs');
        this.path = require('path');
        this.logDir = this.path.join(__dirname, '../../logs');
        
        // Cria o diretório de logs se não existir
        if (!this.fs.existsSync(this.logDir)) {
            this.fs.mkdirSync(this.logDir, { recursive: true });
        }
        
        this.errorLogPath = this.path.join(this.logDir, 'error.log');
    }

    /**
     * Formata a data e hora atual
     * @returns {string} Data e hora formatadas
     */
    getTimestamp() {
        const now = new Date();
        return now.toISOString();
    }

    /**
     * Registra uma mensagem de informação
     * @param {string} mensagem - Mensagem a ser registrada
     */
    info(mensagem) {
        const log = `[INFO] ${this.getTimestamp()} - ${mensagem}`;
        console.log(log);
    }

    /**
     * Registra uma mensagem de aviso
     * @param {string} mensagem - Mensagem a ser registrada
     */
    warning(mensagem) {
        const log = `[WARNING] ${this.getTimestamp()} - ${mensagem}`;
        console.warn(log);
    }

    /**
     * Registra uma mensagem de erro
     * @param {string} mensagem - Mensagem a ser registrada
     */
    error(mensagem) {
        const log = `[ERROR] ${this.getTimestamp()} - ${mensagem}`;
        console.error(log);
        
        // Registra o erro no arquivo de log
        this.fs.appendFileSync(this.errorLogPath, log + '\n');
    }

    /**
     * Registra uma mensagem de depuração
     * @param {string} mensagem - Mensagem a ser registrada
     */
    debug(mensagem) {
        const log = `[DEBUG] ${this.getTimestamp()} - ${mensagem}`;
        console.debug(log);
    }
}

module.exports = Logger;
