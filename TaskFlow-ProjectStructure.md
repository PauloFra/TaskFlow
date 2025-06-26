# TaskFlow: Estrutura do Projeto

Com base em nossas decisões arquiteturais de usar Node.js com Express, Next.js, Drizzle ORM e PostgreSQL, aqui está a estrutura proposta para o projeto:

```
taskflow/
├── .github/                  # Configuração de CI/CD
├── docker/                   # Arquivos relacionados ao Docker
│   ├── api.Dockerfile        # Dockerfile do serviço de API
│   └── web.Dockerfile        # Dockerfile do aplicativo web
├── packages/                 # Pacotes compartilhados
│   ├── database/             # Código relacionado ao banco de dados
│   │   ├── migrations/       # Migrações do Drizzle
│   │   ├── schema/           # Definições de esquema do Drizzle
│   │   └── index.ts          # Conexão com o banco de dados e exportações
│   └── shared/               # Utilitários e tipos compartilhados
│       ├── types/            # Definições de tipos TypeScript
│       └── utils/            # Funções utilitárias compartilhadas
├── apps/
│   ├── api/                  # Backend Express
│   │   ├── src/
│   │   │   ├── config/       # Configurações da aplicação
│   │   │   ├── controllers/  # Controladores da API
│   │   │   ├── middleware/   # Middleware do Express
│   │   │   ├── routes/       # Definições de rotas da API
│   │   │   ├── services/     # Serviços de lógica de negócios
│   │   │   ├── utils/        # Funções utilitárias
│   │   │   └── index.ts      # Entrada principal da aplicação
│   │   ├── tests/            # Testes da API
│   │   └── package.json      # Dependências da API
│   └── web/                  # Frontend Next.js
│       ├── public/           # Recursos estáticos
│       ├── src/
│       │   ├── app/          # App Router do Next.js
│   │   │   ├── (auth)/   # Rotas de autenticação (login/registro)
│   │   │   ├── dashboard/# Dashboard do usuário
│   │   │   ├── workspace/# Gerenciamento de espaços de trabalho
│   │   │   └── api/      # Rotas de API do Next.js
│   │   ├── components/   # Componentes React
│   │   │   ├── ui/       # Componentes de UI (botões, inputs, etc.)
│   │   │   ├── auth/     # Componentes de autenticação
│   │   │   ├── dashboard/# Componentes do dashboard
│   │   │   └── workspace/# Componentes do espaço de trabalho
│   │   ├── hooks/        # Hooks React personalizados
│   │   ├── lib/          # Utilitários do frontend
│   │   ├── store/        # Gerenciamento de estado
│   │   └── styles/       # Estilos globais
│   │   └── package.json      # Dependências do frontend
├── .env.example              # Exemplo de variáveis de ambiente
├── docker-compose.yml        # Configuração do Docker Compose
├── package.json              # Package.json raiz para scripts
└── README.md                 # Documentação do projeto
```

## Explicação dos Diretórios e Arquivos Principais

### Backend (API Express)

- **config/**: Configuração da aplicação, incluindo variáveis de ambiente, constantes e objetos de configuração.
- **controllers/**: Manipuladores de requisições HTTP que recebem solicitações das rotas e retornam respostas.
- **middleware/**: Middleware do Express para autenticação, tratamento de erros, logging, etc.
- **routes/**: Definições de rotas da API que mapeiam métodos HTTP para funções do controlador.
- **services/**: Lógica de negócios que os controladores chamam para realizar operações.
- **utils/**: Funções utilitárias e auxiliares utilizadas em toda a API.

### Frontend (Next.js)

- **app/**: App Router do Next.js com roteamento baseado em diretórios.
  - **(auth)/**: Grupo para rotas relacionadas à autenticação (login/registro).
  - **dashboard/**: Dashboard do usuário e gerenciamento de tarefas.
  - **workspace/**: Rotas de gerenciamento de espaços de trabalho.
  - **api/**: Rotas de API do Next.js para APIs específicas do frontend.
- **components/**: Componentes React organizados por recurso ou domínio.
- **hooks/**: Hooks React personalizados para lógica compartilhada.
- **lib/**: Funções utilitárias do frontend.
- **store/**: Configuração de gerenciamento de estado (se usar Redux, Zustand, etc.).

### Pacotes Compartilhados

- **database/**: Esquema do banco de dados, migrações e configuração de conexão.
- **shared/**: Tipos e utilitários compartilhados entre backend e frontend.

### Configuração Docker

- **docker-compose.yml**: Definições de serviços para desenvolvimento e produção.
- **docker/**: Dockerfiles específicos para cada serviço.

## Organização do Esquema do Banco de Dados

O esquema do banco de dados será definido em `packages/database/schema/` com arquivos para cada entidade de domínio:

```
packages/database/schema/
├── users.ts               # Tabelas relacionadas a usuários
├── workspaces.ts          # Tabelas relacionadas a espaços de trabalho
├── tasks.ts               # Tabelas relacionadas a tarefas
├── comments.ts            # Tabelas relacionadas a comentários
├── relations.ts           # Relacionamentos entre tabelas
└── index.ts               # Exporta todos os esquemas
```

## Fluxo de Autenticação

O sistema de autenticação será implementado usando JWT:

1. Autenticação do usuário via backend Express
2. Geração e validação de token JWT
3. Armazenamento de token em cookies HTTP-only
4. Estratégia de token de atualização para sessões persistentes

## Fluxo de Desenvolvimento

1. Iniciar serviços com `docker-compose up`
2. Executar migrações com script npm
3. Servidores de desenvolvimento backend e frontend com recarregamento automático
4. Tipos compartilhados sincronizados automaticamente entre backend e frontend

## Estratégia de Implantação

1. Construir imagens Docker para cada serviço
2. Implantar via Docker Compose ou orquestração de contêineres
3. Configurações específicas para cada ambiente via arquivos .env
4. Migrações de banco de dados executadas durante a implantação
