/**
 * Formatador de respostas para API
 * Responsável por padronizar o formato das respostas da API
 */
class ResponseFormatter {
    /**
     * Formata uma resposta de sucesso
     * @param {string} mensagem - Mensagem de sucesso
     * @param {object|array} dados - Dados a serem retornados
     * @param {number} statusCode - Código de status HTTP (padrão: 200)
     * @returns {object} Resposta formatada
     */
    static sucesso(mensagem, dados = null, statusCode = 200) {
        const resposta = {
            sucesso: true,
            mensagem: mensagem
        };

        if (dados !== null) {
            resposta.dados = dados;
        }

        return {
            statusCode,
            body: resposta
        };
    }

    /**
     * Formata uma resposta de erro
     * @param {string} mensagem - Mensagem de erro
     * @param {string} codigoErro - Código de erro
     * @param {number} statusCode - Código de status HTTP (padrão: 500)
     * @returns {object} Resposta formatada
     */
    static erro(mensagem, codigoErro = 'INTERNAL_ERROR', statusCode = 500) {
        return {
            statusCode,
            body: {
                sucesso: false,
                mensagem: mensagem,
                erro: codigoErro
            }
        };
    }

    /**
     * Formata uma resposta de erro de validação
     * @param {string} mensagem - Mensagem de erro
     * @param {Array<string>} erros - Lista de erros de validação
     * @returns {object} Resposta formatada
     */
    static erroValidacao(mensagem, erros = []) {
        return {
            statusCode: 400,
            body: {
                sucesso: false,
                mensagem: mensagem,
                erro: 'VALIDATION_ERROR',
                erros: erros
            }
        };
    }

    /**
     * Formata uma resposta de erro de autenticação
     * @param {string} mensagem - Mensagem de erro
     * @returns {object} Resposta formatada
     */
    static erroAutenticacao(mensagem = 'Autenticação necessária') {
        return {
            statusCode: 401,
            body: {
                sucesso: false,
                mensagem: mensagem,
                erro: 'UNAUTHORIZED'
            }
        };
    }

    /**
     * Formata uma resposta de erro de permissão
     * @param {string} mensagem - Mensagem de erro
     * @returns {object} Resposta formatada
     */
    static erroPermissao(mensagem = 'Permissão negada') {
        return {
            statusCode: 403,
            body: {
                sucesso: false,
                mensagem: mensagem,
                erro: 'FORBIDDEN'
            }
        };
    }

    /**
     * Formata uma resposta de erro de recurso não encontrado
     * @param {string} mensagem - Mensagem de erro
     * @returns {object} Resposta formatada
     */
    static erroNaoEncontrado(mensagem = 'Recurso não encontrado') {
        return {
            statusCode: 404,
            body: {
                sucesso: false,
                mensagem: mensagem,
                erro: 'NOT_FOUND'
            }
        };
    }
}

module.exports = ResponseFormatter;
