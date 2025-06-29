/**
 * Repositório para operações com Eventos
 */
class EventoRepository extends require('./BaseRepository') {
    /**
     * Cria uma nova instância do repositório de eventos
     */
    constructor() {
        super('eventos');
        this.Evento = require('../domain/Evento');
    }

    /**
     * Cria um novo evento
     * @param {object} dados - Dados do evento
     * @returns {Promise<object>} Evento criado
     */
    async criar(dados) {
        // Cria uma instância do modelo para validação
        const evento = new this.Evento(dados);
        const validacao = evento.validar();
        
        if (!validacao.valido) {
            throw new Error(`Erro de validação: ${validacao.erros.join(', ')}`);
        }
        
        // Adiciona timestamps
        dados.dataCriacao = new Date();
        dados.dataAtualizacao = new Date();
        
        return super.criar(dados);
    }

    /**
     * Atualiza um evento existente
     * @param {string} id - ID do evento
     * @param {object} dados - Dados a serem atualizados
     * @returns {Promise<object|null>} Evento atualizado ou null
     */
    async atualizar(id, dados) {
        // Busca o evento atual para validação
        const eventoAtual = await this.buscarPorId(id);
        
        if (!eventoAtual) {
            return null;
        }
        
        // Cria uma instância do modelo com os dados atualizados para validação
        const eventoAtualizado = new this.Evento({
            ...eventoAtual,
            ...dados
        });
        
        const validacao = eventoAtualizado.validar();
        
        if (!validacao.valido) {
            throw new Error(`Erro de validação: ${validacao.erros.join(', ')}`);
        }
        
        // Atualiza o timestamp
        dados.dataAtualizacao = new Date();
        
        return super.atualizar(id, dados);
    }

    /**
     * Busca eventos por data
     * @param {Date|string} data - Data para busca
     * @returns {Promise<Array<object>>} Lista de eventos
     */
    async buscarPorData(data) {
        try {
            const dataObj = new Date(data);
            const inicioDia = new Date(dataObj.setHours(0, 0, 0, 0));
            const fimDia = new Date(dataObj.setHours(23, 59, 59, 999));
            
            return this.buscar({
                $or: [
                    // Eventos que começam neste dia
                    {
                        dataInicio: {
                            $gte: inicioDia,
                            $lte: fimDia
                        }
                    },
                    // Eventos que terminam neste dia
                    {
                        dataFim: {
                            $gte: inicioDia,
                            $lte: fimDia
                        }
                    },
                    // Eventos que abrangem este dia
                    {
                        dataInicio: { $lte: inicioDia },
                        dataFim: { $gte: fimDia }
                    }
                ]
            });
        } catch (erro) {
            this.logger.error(`Erro ao buscar eventos por data: ${erro.message}`);
            throw erro;
        }
    }

    /**
     * Busca eventos por intervalo de datas
     * @param {Date|string} dataInicio - Data de início
     * @param {Date|string} dataFim - Data de fim
     * @returns {Promise<Array<object>>} Lista de eventos
     */
    async buscarPorIntervalo(dataInicio, dataFim) {
        try {
            const inicio = new Date(dataInicio);
            const fim = new Date(dataFim);
            
            return this.buscar({
                $or: [
                    // Eventos que começam no intervalo
                    {
                        dataInicio: {
                            $gte: inicio,
                            $lte: fim
                        }
                    },
                    // Eventos que terminam no intervalo
                    {
                        dataFim: {
                            $gte: inicio,
                            $lte: fim
                        }
                    },
                    // Eventos que abrangem o intervalo
                    {
                        dataInicio: { $lte: inicio },
                        dataFim: { $gte: fim }
                    }
                ]
            });
        } catch (erro) {
            this.logger.error(`Erro ao buscar eventos por intervalo: ${erro.message}`);
            throw erro;
        }
    }

    /**
     * Busca eventos por usuário
     * @param {string} usuarioId - ID do usuário
     * @returns {Promise<Array<object>>} Lista de eventos
     */
    async buscarPorUsuario(usuarioId) {
        return this.buscar({ usuarioId });
    }

    /**
     * Busca eventos por categoria
     * @param {string} categoriaId - ID da categoria
     * @returns {Promise<Array<object>>} Lista de eventos
     */
    async buscarPorCategoria(categoriaId) {
        return this.buscar({ categoriaId });
    }
}

module.exports = EventoRepository;
