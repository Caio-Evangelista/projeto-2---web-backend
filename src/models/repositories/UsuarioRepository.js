/**
 * Repositório para operações com Usuários
 */
class UsuarioRepository extends require("./BaseRepository") {
	/**
	 * Cria uma nova instância do repositório de usuários
	 */
	constructor() {
		super("usuarios");
		this.Usuario = require("../domain/Usuario");
	}

	/**
	 * Cria um novo usuário
	 * @param {object} dados - Dados do usuário
	 * @returns {Promise<object>} Usuário criado
	 */
	async criar(dados) {
		// Cria uma instância do modelo para validação
		const usuario = new this.Usuario(dados);
		const validacao = usuario.validar();

		if (!validacao.valido) {
			throw new Error(`Erro de validação: ${validacao.erros.join(", ")}`);
		}

		// Verifica se o email já está em uso
		const usuarioExistente = await this.buscarPorEmail(dados.email);
		if (usuarioExistente) {
			throw new Error("Email já está em uso");
		}

		// Adiciona timestamps
		dados.dataCriacao = new Date();
		dados.dataAtualizacao = new Date();

		const usuarioCriado = await super.criar(dados);

		// Remove a senha do objeto retornado
		const { senha, ...usuarioSemSenha } = usuarioCriado;
		return usuarioSemSenha;
	}

	/**
	 * Atualiza um usuário existente
	 * @param {string} id - ID do usuário
	 * @param {object} dados - Dados a serem atualizados
	 * @returns {Promise<object|null>} Usuário atualizado ou null
	 */
	async atualizar(id, dados) {
		// Busca o usuário atual para validação
		const usuarioAtual = await this.buscarPorId(id);

		if (!usuarioAtual) {
			return null;
		}

		// Se estiver atualizando o email, verifica se já está em uso
		if (dados.email && dados.email !== usuarioAtual.email) {
			const usuarioExistente = await this.buscarPorEmail(dados.email);
			if (usuarioExistente) {
				throw new Error("Email já está em uso");
			}
		}

		// Cria uma instância do modelo com os dados atualizados para validação
		const usuarioAtualizado = new this.Usuario({
			...usuarioAtual,
			...dados,
		});

		// Validação apenas se estiver atualizando campos críticos
		if (dados.email || dados.senha) {
			const validacao = usuarioAtualizado.validar();

			if (!validacao.valido) {
				throw new Error(
					`Erro de validação: ${validacao.erros.join(", ")}`
				);
			}
		}

		// Atualiza o timestamp
		dados.dataAtualizacao = new Date();

		const resultado = await super.atualizar(id, dados);

		if (resultado) {
			// Remove a senha do objeto retornado
			const { senha, ...usuarioSemSenha } = resultado;
			return usuarioSemSenha;
		}

		return null;
	}

	/**
	 * Busca um usuário pelo email
	 * @param {string} email - Email do usuário
	 * @returns {Promise<object|null>} Usuário encontrado ou null
	 */
	async buscarPorEmail(email) {
		try {
			const db = await this.database.conectar();
			const collection = db.collection(this.collectionName);

			const usuario = await collection.findOne({ email });

			if (usuario) {
				this.logger.info(`Usuário encontrado pelo email: ${email}`);
			} else {
				this.logger.warning(
					`Usuário não encontrado pelo email: ${email}`
				);
			}

			return usuario;
		} catch (erro) {
			this.logger.error(
				`Erro ao buscar usuário pelo email: ${erro.message}`
			);
			throw erro;
		}
	}

	/**
	 * Verifica se as credenciais de um usuário são válidas
	 * @param {string} email - Email do usuário
	 * @param {string} senha - Senha do usuário
	 * @returns {Promise<object|null>} Usuário autenticado ou null
	 */
	async verificarCredenciais(email, senha) {
		try {
			const usuario = await this.buscarPorEmail(email);

			if (!usuario) {
				return null;
			}

			if (senha != usuario.senha) {
				return null;
			}

			// Remove a senha do objeto retornado
			const { senha: _, ...usuarioSemSenha } = usuario;
			return usuarioSemSenha;
		} catch (erro) {
			this.logger.error(`Erro ao verificar credenciais: ${erro.message}`);
			throw erro;
		}
	}
}

module.exports = UsuarioRepository;
