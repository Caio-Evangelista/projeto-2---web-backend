# Agenda Eletrônica Web - Arquitetura MVC

## Visão Geral
Agenda Eletrônica é uma API REST para gerenciamento de eventos em um calendário, desenvolvida com Node.js, Express e MongoDB, seguindo rigorosamente o padrão arquitetural MVC (Model-View-Controller).

## Características
- Arquitetura MVC com separação clara de responsabilidades
- API REST completa para gerenciamento de eventos
- Sistema de autenticação e controle de acesso
- Validação rigorosa de dados
- Tratamento padronizado de erros
- Testes automatizados abrangentes

## Requisitos
- Node.js 14+
- MongoDB 4+

## Bibliotecas Utilizadas

### Dependências Principais
```json
{
  "bcryptjs": "^2.4.3",      // Criptografia de senhas
  "connect-mongo": "^4.6.0",  // Armazenamento de sessões no MongoDB
  "express": "^4.18.2",      // Framework web para API REST
  "express-session": "^1.17.3", // Gerenciamento de sessões
  "moment": "^2.29.4",       // Manipulação de datas
  "mongodb": "^4.13.0"       // Driver do MongoDB
}
```

### Dependências de Desenvolvimento
```json
{
  "axios": "^1.3.4",         // Cliente HTTP para testes e simulações
  "jest": "^29.5.0",         // Framework de testes
  "nodemon": "^2.0.22",      // Reinicialização automática do servidor
  "supertest": "^6.3.3"      // Testes de integração para APIs HTTP
}
```

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/agenda-eletronica-mvc.git
cd agenda-eletronica-mvc
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a conexão com o MongoDB:
Edite o arquivo `config/database.js` com as informações de conexão do seu banco de dados.

4. Inicie a aplicação:
```bash
npm start
```

A API estará disponível em `http://localhost:3000/api/status`.

## Estrutura do Projeto (MVC)

```
agenda-eletronica-mvc/
├── src/
│   ├── models/               # Camada de Model
│   │   ├── domain/           # Modelos de domínio
│   │   │   ├── Evento.js
│   │   │   ├── Usuario.js
│   │   │   └── Categoria.js
│   │   ├── services/         # Serviços de negócio
│   │   │   └── AuthService.js
│   │   └── repositories/     # Acesso a dados
│   │       ├── BaseRepository.js
│   │       ├── EventoRepository.js
│   │       ├── UsuarioRepository.js
│   │       └── CategoriaRepository.js
│   ├── views/                # Camada de View (formatadores de resposta)
│   │   └── ResponseFormatter.js
│   ├── controllers/          # Camada de Controller
│   │   ├── AuthController.js
│   │   ├── EventoController.js
│   │   ├── UsuarioController.js
│   │   └── CategoriaController.js
│   ├── routes/               # Definição de rotas
│   │   ├── authRoutes.js
│   │   ├── eventoRoutes.js
│   │   ├── usuarioRoutes.js
│   │   └── categoriaRoutes.js
│   ├── middleware/           # Middleware da aplicação
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── utils/                # Utilitários
│   │   ├── Database.js
│   │   └── Logger.js
│   ├── app.js                # Configuração do Express
│   └── server.js             # Ponto de entrada da aplicação
├── config/
│   ├── database.js           # Configurações do banco de dados
│   └── auth.js               # Configurações de autenticação
├── logs/                     # Diretório para armazenamento de logs
├── tests/                    # Testes automatizados
│   ├── unit/                 # Testes unitários
│   │   ├── authService.test.js
│   │   ├── eventoController.test.js
│   │   └── ...
│   └── integration/          # Testes de integração
│       ├── authRoutes.test.js
│       ├── eventoRoutes.test.js
│       └── ...
├── exemplo_api.js            # Arquivo de exemplo para simulação de chamadas API
├── relatorio_testes.md       # Relatório detalhado de testes e validação
├── public/                   # Arquivos estáticos
└── package.json              # Configurações do projeto
```

## Fluxo MVC

1. **Requisição HTTP** → Roteador Express
2. **Roteador** → Encaminha para o Controller apropriado
3. **Controller**:
   - Recebe a requisição
   - Valida dados de entrada (com middleware)
   - Chama serviços/repositórios do Model
4. **Model**:
   - Executa lógica de negócio
   - Acessa o banco de dados
   - Retorna dados processados ao Controller
5. **Controller**:
   - Recebe dados do Model
   - Passa para o ResponseFormatter (View)
6. **View (ResponseFormatter)**:
   - Formata os dados em resposta JSON padronizada
7. **Controller**:
   - Envia resposta formatada ao cliente

## Endpoints da API

### Autenticação

#### Registro de Usuário
```
POST /api/auth/registrar
```
Corpo da requisição:
```json
{
  "nome": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "senha": "senha123"
}
```

#### Login
```
POST /api/auth/login
```
Corpo da requisição:
```json
{
  "email": "usuario@exemplo.com",
  "senha": "senha123"
}
```

#### Logout
```
POST /api/auth/logout
```

#### Perfil do Usuário
```
GET /api/auth/perfil
```

### Eventos

#### Criar Evento
```
POST /api/eventos
```
Corpo da requisição:
```json
{
  "titulo": "Reunião de Equipe",
  "descricao": "Discussão sobre o novo projeto",
  "dataInicio": "2025-07-01T14:00:00.000Z",
  "dataFim": "2025-07-01T15:30:00.000Z",
  "local": "Sala de Reuniões",
  "categoriaId": "id_da_categoria"
}
```

#### Listar Eventos
```
GET /api/eventos
```

#### Buscar Evento por ID
```
GET /api/eventos/:id
```

#### Buscar Eventos por Data
```
GET /api/eventos/data/:data
```

#### Buscar Eventos por Intervalo
```
GET /api/eventos/intervalo?dataInicio=2025-07-01&dataFim=2025-07-31
```

#### Atualizar Evento
```
PUT /api/eventos/:id
```

#### Remover Evento
```
DELETE /api/eventos/:id
```

### Categorias

#### Criar Categoria
```
POST /api/categorias
```
Corpo da requisição:
```json
{
  "nome": "Trabalho",
  "cor": "#FF5733"
}
```

#### Listar Categorias
```
GET /api/categorias
```

#### Buscar Categoria por ID
```
GET /api/categorias/:id
```

#### Atualizar Categoria
```
PUT /api/categorias/:id
```

#### Remover Categoria
```
DELETE /api/categorias/:id
```

### Usuários

#### Buscar Usuário por ID
```
GET /api/usuarios/:id
```

#### Atualizar Usuário
```
PUT /api/usuarios/:id
```

#### Alterar Senha
```
POST /api/usuarios/:id/alterar-senha
```
Corpo da requisição:
```json
{
  "senhaAtual": "senha_atual",
  "novaSenha": "nova_senha"
}
```

## Simulação de Chamadas API

O projeto inclui um arquivo de exemplo (`exemplo_api.js`) que demonstra o uso completo da API através de requisições HTTP usando a biblioteca axios. Este arquivo simula um fluxo completo de uso da API, incluindo:

1. Registro de usuário
2. Login
3. Criação de categorias
4. Criação de eventos
5. Busca de eventos por data
6. Atualização de eventos
7. Remoção de eventos
8. Logout

Para executar o arquivo de simulação:

```bash
# Certifique-se de que o servidor está em execução
npm start

# Em outro terminal, execute:
node exemplo_api.js
```

Exemplo de saída:

```
Iniciando simulação da API da Agenda Eletrônica...

1. Registrando novo usuário...
==================================================
Registro de Usuário:
--------------------------------------------------
{
  "sucesso": true,
  "mensagem": "Usuário registrado com sucesso",
  "dados": {
    "_id": "60f1a2b3c4d5e6f7g8h9i0j1",
    "nome": "Usuário Teste",
    "email": "usuario.teste.1624982345678@exemplo.com"
  }
}
==================================================

2. Realizando login...
...
```

## Exemplos de Uso com cURL

### Registro de Usuário
```bash
curl -X POST http://localhost:3000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome": "João Silva", "email": "joao@exemplo.com", "senha": "senha123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@exemplo.com", "senha": "senha123"}' \
  -c cookies.txt
```

### Criar Evento
```bash
curl -X POST http://localhost:3000/api/eventos \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"titulo": "Reunião", "descricao": "Discussão de projeto", "dataInicio": "2025-07-01T14:00:00.000Z", "dataFim": "2025-07-01T15:30:00.000Z"}'
```

### Listar Eventos
```bash
curl -X GET http://localhost:3000/api/eventos \
  -b cookies.txt
```

## Testes

### Executar Todos os Testes
```bash
npm test
```

### Executar Apenas Testes Unitários
```bash
npm run test:unit
```

### Executar Apenas Testes de Integração
```bash
npm run test:integration
```

## Relatório de Testes
Um relatório detalhado dos testes e validações realizadas está disponível no arquivo `relatorio_testes.md`.

## Desenvolvimento

### Modo de Desenvolvimento
```bash
npm run dev
```

### Estrutura de Arquivos
- **Models**: Representam os dados e a lógica de negócios
  - **Domain**: Entidades de negócio
  - **Repositories**: Acesso a dados
  - **Services**: Lógica de negócio complexa
- **Views**: Formatam as respostas da API
- **Controllers**: Gerenciam o fluxo entre Model e View
- **Routes**: Definem os endpoints da API
- **Middleware**: Componentes para autenticação, validação e tratamento de erros
- **Utils**: Classes utilitárias como Database e Logger

## Licença
ISC
