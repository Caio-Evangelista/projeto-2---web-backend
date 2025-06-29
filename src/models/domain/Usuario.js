/**
 * Modelo de domínio para Usuario
 * Representa um usuário da agenda eletrônica
 */
class Usuario {
    /**
     * Cria uma nova instância do modelo Usuario
     * @param {object} dados - Dados do usuário
     */
    constructor(dados = {}) {
        this._id = dados._id || null;
        this.nome = dados.nome || '';
        this.email = dados.email || '';
        this.senha = dados.senha || '';
        this.telefone = dados.telefone || '';
        this.dataCriacao = dados.dataCriacao || new Date();
        this.dataAtualizacao = dados.dataAtualizacao || new Date();
    }

    /**
     * Valida os dados do usuário
     * @returns {object} Resultado da validação {valido: boolean, erros: array}
     */
    validar() {
        const erros = [];

        // Validação de campos obrigatórios
        if (!this.nome) {
            erros.push('O nome é obrigatório');
        }

        if (!this.email) {
            erros.push('O email é obrigatório');
        } else if (!this.validarEmail(this.email)) {
            erros.push('O email é inválido');
        }

        if (!this.senha) {
            erros.push('A senha é obrigatória');
        } else if (this.senha.length < 6) {
            erros.push('A senha deve ter pelo menos 6 caracteres');
        }

        return {
            valido: erros.length === 0,
            erros: erros
        };
    }

    /**
     * Valida um endereço de email
     * @param {string} email - Email a ser validado
     * @returns {boolean} true se válido, false se inválido
     */
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Converte o modelo para um objeto simples
     * @returns {object} Objeto representando o usuário
     */
    toObject() {
        return {
            _id: this._id,
            nome: this.nome,
            email: this.email,
            senha: this.senha,
            telefone: this.telefone,
            dataCriacao: this.dataCriacao,
            dataAtualizacao: this.dataAtualizacao
        };
    }

    /**
     * Retorna uma versão do objeto sem a senha
     * @returns {object} Objeto representando o usuário sem a senha
     */
    toSafeObject() {
        const obj = this.toObject();
        delete obj.senha;
        return obj;
    }
}

module.exports = Usuario;
