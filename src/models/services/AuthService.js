/**
 * Serviço de autenticação
 * Responsável pela lógica de negócio relacionada à autenticação de usuários
 */
class AuthService {
	/**
	 * Cria uma nova instância do serviço de autenticação
	 */
	constructor() {
		this.UsuarioRepository = require("../repositories/UsuarioRepository");
		this.usuarioRepository = new this.UsuarioRepository();
		this.Logger = require("../../utils/Logger");
		this.logger = new this.Logger();
	}

	/**
	 * Registra um novo usuário
	 * @param {object} dados - Dados do usuário
	 * @returns {Promise<object>} Usuário registrado (sem senha)
	 */
	async registrar(dados) {
		try {
			// Validação de campos obrigatórios
			if (!dados.nome || !dados.email || !dados.senha) {
				throw new Error("Nome, email e senha são obrigatórios");
			}

			// Validação de formato de email
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(dados.email)) {
				throw new Error("Formato de email inválido");
			}

			// Validação de senha
			if (dados.senha.length < 6) {
				throw new Error("A senha deve ter pelo menos 6 caracteres");
			}

			// Verifica se o email já está em uso
			const usuarioExistente =
				await this.usuarioRepository.buscarPorEmail(dados.email);

			if (usuarioExistente) {
				throw new Error("Email já está em uso");
			}

			// Cria o usuário com a senha criptografada
			const dadosComSenhaCriptografada = {
				...dados,
				senha: dados.senha,
			};

			const usuarioCriado = await this.usuarioRepository.criar(
				dadosComSenhaCriptografada
			);

			// Remove a senha do objeto retornado
			const { senha: _, ...usuarioSemSenha } = usuarioCriado;

			this.logger.info(`Usuário registrado com sucesso: ${dados.email}`);

			return usuarioSemSenha;
		} catch (erro) {
			this.logger.error(`Erro ao registrar usuário: ${erro.message}`);
			throw new Error(`Erro ao registrar usuário: ${erro.message}`);
		}
	}

	/**
	 * Autentica um usuário
	 * @param {string} email - Email do usuário
	 * @param {string} senha - Senha do usuário
	 * @returns {Promise<object>} Usuário autenticado (sem senha)
	 */
	async autenticar(email, senha) {
		try {
			// Validação de campos obrigatórios
			if (!email || !senha) {
				throw new Error("Email e senha são obrigatórios");
			}

			// Busca o usuário pelo email
			const usuario = await this.usuarioRepository.buscarPorEmail(email);

			if (!usuario) {
				throw new Error("Credenciais inválidas");
			}

			if (senha != usuario.senha) {
				throw new Error("Credenciais inválidas");
			}

			// Remove a senha do objeto retornado
			const { senha: _, ...usuarioSemSenha } = usuario;

			this.logger.info(`Usuário autenticado com sucesso: ${email}`);

			return usuarioSemSenha;
		} catch (erro) {
			this.logger.error(`Erro ao autenticar usuário: ${erro.message}`);
			throw new Error(`Erro ao autenticar usuário: ${erro.message}`);
		}
	}

	/**
	 * Altera a senha de um usuário
	 * @param {string} id - ID do usuário
	 * @param {string} senhaAtual - Senha atual
	 * @param {string} novaSenha - Nova senha
	 * @returns {Promise<boolean>} true se a senha foi alterada, false caso contrário
	 */
	async alterarSenha(id, senhaAtual, novaSenha) {
		try {
			// Validação de campos obrigatórios
			if (!id || !senhaAtual || !novaSenha) {
				throw new Error(
					"ID do usuário, senha atual e nova senha são obrigatórios"
				);
			}

			// Validação de senha
			if (novaSenha.length < 6) {
				throw new Error(
					"A nova senha deve ter pelo menos 6 caracteres"
				);
			}

			// Busca o usuário pelo ID
			const usuario = await this.usuarioRepository.buscarPorId(id);

			if (!usuario) {
				throw new Error("Usuário não encontrado");
			}

			// Verifica a senha atual
			const senhaValida = await this.bcrypt.compare(
				senhaAtual,
				usuario.senha
			);

			if (!senhaValida) {
				throw new Error("Senha atual incorreta");
			}

			// Verifica se a nova senha é diferente da atual
			if (senhaAtual === novaSenha) {
				throw new Error("A nova senha deve ser diferente da atual");
			}

			// Criptografa a nova senha
			const salt = await this.bcrypt.genSalt(10);
			const senhaCriptografada = await this.bcrypt.hash(novaSenha, salt);

			// Atualiza a senha
			await this.usuarioRepository.atualizar(id, {
				senha: senhaCriptografada,
			});

			this.logger.info(
				`Senha alterada com sucesso para o usuário: ${usuario.email}`
			);

			return true;
		} catch (erro) {
			this.logger.error(`Erro ao alterar senha: ${erro.message}`);
			throw new Error(`Erro ao alterar senha: ${erro.message}`);
		}
	}
}

module.exports = AuthService;
