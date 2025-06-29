/**
 * Modelo de domínio para Evento
 * Representa um evento na agenda eletrônica
 */
class Evento {
    /**
     * Cria uma nova instância do modelo Evento
     * @param {object} dados - Dados do evento
     */
    constructor(dados = {}) {
        this._id = dados._id || null;
        this.titulo = dados.titulo || '';
        this.descricao = dados.descricao || '';
        this.dataInicio = dados.dataInicio || null;
        this.dataFim = dados.dataFim || null;
        this.local = dados.local || '';
        this.usuarioId = dados.usuarioId || null;
        this.categoriaId = dados.categoriaId || null;
        this.dataCriacao = dados.dataCriacao || new Date();
        this.dataAtualizacao = dados.dataAtualizacao || new Date();
    }

    /**
     * Valida os dados do evento
     * @returns {object} Resultado da validação {valido: boolean, erros: array}
     */
    validar() {
        const erros = [];

        // Validação de campos obrigatórios
        if (!this.titulo) {
            erros.push('O título é obrigatório');
        }

        if (!this.dataInicio) {
            erros.push('A data de início é obrigatória');
        }

        if (!this.usuarioId) {
            erros.push('O ID do usuário é obrigatório');
        }

        // Validação de datas
        if (this.dataInicio && this.dataFim && new Date(this.dataInicio) > new Date(this.dataFim)) {
            erros.push('A data de início não pode ser posterior à data de fim');
        }

        return {
            valido: erros.length === 0,
            erros: erros
        };
    }

    /**
     * Converte o modelo para um objeto simples
     * @returns {object} Objeto representando o evento
     */
    toObject() {
        return {
            _id: this._id,
            titulo: this.titulo,
            descricao: this.descricao,
            dataInicio: this.dataInicio,
            dataFim: this.dataFim,
            local: this.local,
            usuarioId: this.usuarioId,
            categoriaId: this.categoriaId,
            dataCriacao: this.dataCriacao,
            dataAtualizacao: this.dataAtualizacao
        };
    }
}

module.exports = Evento;
