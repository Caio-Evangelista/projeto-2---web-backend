/**
 * Servidor da aplicação
 */
const app = require('./app');
const Logger = require('./utils/Logger');
const logger = new Logger();

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Inicialização do servidor
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Servidor iniciado na porta ${PORT}`);
    logger.info(`API disponível em http://localhost:${PORT}/api/status`);
});
