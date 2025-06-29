/**
 * Arquivo de exemplo para simulação de chamadas à API da Agenda Eletrônica
 *
 * Este arquivo demonstra como utilizar a API da Agenda Eletrônica através de requisições HTTP
 * usando a biblioteca axios. Ele simula um fluxo completo de uso da API, incluindo:
 *
 * 1. Registro de usuário
 * 2. Login
 * 3. Criação de categorias
 * 4. Criação de eventos
 * 5. Busca de eventos por data
 * 6. Atualização de eventos
 * 7. Remoção de eventos
 * 8. Logout
 *
 * Para executar este exemplo:
 * 1. Certifique-se de que o servidor da API está em execução
 * 2. Execute: node exemplo_api.js
 */

const axios = require("axios");
const moment = require("moment");

// Configuração base para o axios
const api = axios.create({
	baseURL: "http://localhost:3000/api",
	withCredentials: true, // Importante para manter cookies de sessão
});

// Função para exibir resultados de forma organizada
const exibirResultado = (titulo, dados) => {
	console.log("\n" + "=".repeat(50));
	console.log(`${titulo}:`);
	console.log("-".repeat(50));
	console.log(JSON.stringify(dados, null, 2));
	console.log("=".repeat(50) + "\n");
};

// Função para simular um delay entre as requisições
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Função principal que executa o fluxo completo
async function executarFluxoCompleto() {
	try {
		console.log("Iniciando simulação da API da Agenda Eletrônica...\n");

		// Dados para teste
		const usuario = {
			nome: "Usuário Teste",
			email: `usuario.teste.${Date.now()}@exemplo.com`, // Email único
			senha: "senha123",
		};

		// 1. Registro de usuário
		console.log("1. Registrando novo usuário...");
		const resRegistro = await api.post("/auth/registrar", usuario);
		exibirResultado("Registro de Usuário", resRegistro.data);

		// 2. Login
		console.log("2. Realizando login...");
		const resLogin = await api.post("/auth/login", {
			email: usuario.email,
			senha: usuario.senha,
		});
		exibirResultado("Login", resLogin.data);

		// 3. Criação de categorias
		console.log("3. Criando categorias...");
		const categorias = [
			{ nome: "Trabalho", cor: "#FF5733" },
			{ nome: "Pessoal", cor: "#33FF57" },
		];

		const categoriasRegistradas = [];
		for (const categoria of categorias) {
			const resCategoria = await api.post("/categorias", categoria);
			categoriasRegistradas.push(resCategoria.data.dados);
			exibirResultado(`Categoria ${categoria.nome}`, resCategoria.data);
			await delay(500); // Pequeno delay para evitar sobrecarga
		}

		// 4. Criação de eventos
		console.log("4. Criando eventos...");
		const eventos = [
			{
				usuarioId: resLogin.data.dados._id,
				titulo: "Reunião de Equipe",
				descricao: "Discussão sobre o novo projeto",
				dataInicio: moment()
					.add(1, "day")
					.hour(14)
					.minute(0)
					.second(0)
					.toISOString(),
				dataFim: moment()
					.add(1, "day")
					.hour(15)
					.minute(30)
					.second(0)
					.toISOString(),
				local: "Sala de Reuniões",
				categoriaId: categoriasRegistradas[0]._id,
			},
			{
				usuarioId: resLogin.data.dados._id,
				titulo: "Consulta Médica",
				descricao: "Checkup anual",
				dataInicio: moment()
					.add(2, "day")
					.hour(10)
					.minute(0)
					.second(0)
					.toISOString(),
				dataFim: moment()
					.add(2, "day")
					.hour(11)
					.minute(0)
					.second(0)
					.toISOString(),
				local: "Clínica Central",
				categoriaId: categoriasRegistradas[1]._id,
			},
		];

		const eventosRegistrados = [];
		for (const evento of eventos) {
			const resEvento = await api.post("/eventos", evento);
			eventosRegistrados.push(resEvento.data.dados);
			exibirResultado(`Evento ${evento.titulo}`, resEvento.data);
			await delay(500);
		}

		// 5. Busca de eventos
		console.log("5. Listando todos os eventos...");
		const resListaEventos = await api.get("/eventos");
		exibirResultado("Lista de Eventos", resListaEventos.data);

		// 6. Busca de evento por ID
		const eventoId = eventosRegistrados[0]._id;
		console.log(`6. Buscando evento por ID (${eventoId})...`);
		const resEventoPorId = await api.get(`/eventos/${eventoId}`);
		exibirResultado("Evento por ID", resEventoPorId.data);

		// 7. Busca de eventos por data
		const dataBusca = moment().add(1, "day").format("YYYY-MM-DD");
		console.log(`7. Buscando eventos por data (${dataBusca})...`);
		const resEventosPorData = await api.get(`/eventos/data/${dataBusca}`);
		exibirResultado("Eventos por Data", resEventosPorData.data);

		// 8. Atualização de evento
		console.log("8. Atualizando evento...");
		const dadosAtualizacao = {
			titulo: "Reunião de Equipe (Atualizado)",
			descricao: "Discussão sobre o novo projeto e definição de prazos",
			local: "Sala de Conferências",
		};

		const resEventoAtualizado = await api.put(
			`/eventos/${eventoId}`,
			dadosAtualizacao
		);
		exibirResultado("Evento Atualizado", resEventoAtualizado.data);

		// 9. Busca de evento atualizado
		console.log("9. Verificando evento atualizado...");
		const resEventoAtual = await api.get(`/eventos/${eventoId}`);
		exibirResultado("Evento Após Atualização", resEventoAtual.data);

		// 10. Remoção de evento
		console.log("10. Removendo evento...");
		const resEventoRemovido = await api.delete(`/eventos/${eventoId}`);
		exibirResultado("Evento Removido", resEventoRemovido.data);

		// 11. Verificando remoção
		console.log("11. Verificando lista de eventos após remoção...");
		const resListaFinal = await api.get("/eventos");
		exibirResultado("Lista Final de Eventos", resListaFinal.data);

		// 12. Logout
		console.log("12. Realizando logout...");
		const resLogout = await api.post("/auth/logout");
		exibirResultado("Logout", resLogout.data);

		console.log("\nSimulação concluída com sucesso!");
	} catch (erro) {
		console.error("\n❌ ERRO NA SIMULAÇÃO:");
		if (erro.response) {
			// Erro da API
			console.error("Status:", erro.response.status);
			console.error(
				"Dados:",
				JSON.stringify(erro.response.data, null, 2)
			);
		} else {
			// Erro de conexão ou outro erro
			console.error("Mensagem:", erro.message);
		}
	}
}

// Executa o fluxo completo
executarFluxoCompleto();
