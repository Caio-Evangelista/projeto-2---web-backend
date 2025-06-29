/**
 * Modelo de domínio para Categoria
 * Representa uma categoria para classificação de eventos
 */
class Categoria {
    /**
     * Cria uma nova instância do modelo Categoria
     * @param {object} dados - Dados da categoria
     */
    constructor(dados = {}) {
        this._id = dados._id || null;
        this.nome = dados.nome || '';
        this.cor = dados.cor || '#000000';
        this.dataCriacao = dados.dataCriacao || new Date();
        this.dataAtualizacao = dados.dataAtualizacao || new Date();
    }

    /**
     * Valida os dados da categoria
     * @returns {object} Resultado da validação {valido: boolean, erros: array}
     */
    validar() {
        const erros = [];

        // Validação de campos obrigatórios
        if (!this.nome) {
            erros.push('O nome é obrigatório');
        }

        // Validação do formato da cor (hexadecimal)
        if (this.cor && !this.validarCor(this.cor)) {
            erros.push('A cor deve estar no formato hexadecimal (ex: #FF0000)');
        }

        return {
            valido: erros.length === 0,
            erros: erros
        };
    }

    /**
     * Valida o formato de cor hexadecimal
     * @param {string} cor - Cor a ser validada
     * @returns {boolean} true se válido, false se inválido
     */
    validarCor(cor) {
        const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return regex.test(cor);
    }

    /**
     * Converte o modelo para um objeto simples
     * @returns {object} Objeto representando a categoria
     */
    toObject() {
        return {
            _id: this._id,
            nome: this.nome,
            cor: this.cor,
            dataCriacao: this.dataCriacao,
            dataAtualizacao: this.dataAtualizacao
        };
    }
}

module.exports = Categoria;
