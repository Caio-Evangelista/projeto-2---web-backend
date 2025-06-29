/**
 * Middleware de validação
 * Responsável por validar campos obrigatórios nas requisições
 */
class Validator {
    /**
     * Valida campos obrigatórios
     * @param {Array<string>} campos - Lista de campos obrigatórios
     * @returns {function} Middleware de validação
     */
    static validarCampos(campos) {
        const ResponseFormatter = require('../views/ResponseFormatter');
        
        return (req, res, next) => {
            const camposFaltantes = campos.filter(campo => !req.body[campo]);
            
            if (camposFaltantes.length > 0) {
                const resposta = ResponseFormatter.erroValidacao(
                    'Campos obrigatórios não fornecidos',
                    camposFaltantes.map(campo => `O campo ${campo} é obrigatório`)
                );
                return res.status(resposta.statusCode).json(resposta.body);
            }
            
            next();
        };
    }
}

module.exports = Validator;
