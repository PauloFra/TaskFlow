# Guia Completo da API TaskFlow

## Índice

1. [Introdução às Rotas](#introdução)
2. [Estrutura Básica de Rotas](#estrutura-básica)
3. [Tipos de Rotas](#tipos-de-rotas)
4. [Boas Práticas](#boas-práticas)
5. [Alternativas](#alternativas)
6. [Implementação Completa de Usuários](#implementação-completa-de-usuários)
7. [Middleware de Autenticação Multi-Tenant](#middleware-de-autenticação-multi-tenant)
8. [Conceito de Multi-Tenancy](#conceito-de-multi-tenancy)

## Introdução

As rotas são o coração de qualquer aplicação backend, funcionando como "portais de entrada" que determinam como sua aplicação responde a requisições de clientes. Pense nelas como um sistema de direcionamento inteligente: quando alguém bate à porta da sua API com uma requisição, as rotas decidem:

1. **Se** aquela requisição será atendida
2. **Quem** (qual controlador/função) irá processar essa requisição
3. **Como** a resposta será formatada e devolvida

Em uma aplicação como o TaskFlow que estamos construindo, as rotas transformam sua lógica de negócio em uma interface acessível via HTTP. Sem rotas bem definidas, sua API seria apenas código isolado sem capacidade de comunicação com o mundo exterior.

As rotas são cruciais porque:

- Definem a "interface pública" da sua API
- Estabelecem o contrato de comunicação com os clientes
- Organizam logicamente os recursos da sua aplicação
- Controlam o acesso aos seus dados

**Referências:**

- [Express Routing Guide](https://expressjs.com/en/guide/routing.html)
- [REST API Design Best Practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)

## Estrutura Básica

No contexto do Express.js que estamos utilizando para o TaskFlow, uma rota consiste em três componentes fundamentais:

1. **Método HTTP** - Define a ação sendo realizada (GET, POST, PUT, DELETE, etc.)
2. **Caminho (Path)** - URL específica para acessar o recurso
3. **Handler Function** - Função que processa a requisição e envia uma resposta

### Como o Express lida com isso:

No Express, rotas são definidas através do padrão:

```
app.METHOD(PATH, HANDLER)
```

Onde:

- `app` é a instância do Express
- `METHOD` é o método HTTP em minúsculo
- `PATH` é o caminho no servidor
- `HANDLER` é a função executada quando a rota é correspondida

No caso do nosso módulo de usuários, ao invés de definir rotas diretamente no objeto `app`, utilizamos um **Router** do Express, que permite modularizar rotas relacionadas:

```
const router = Router();
router.post("/", userController.createUser);
```

Este padrão tem vantagens importantes:

- Separa logicamente rotas por domínio funcional (usuários, tarefas, etc.)
- Permite prefixar todas as rotas (ex: `/api/users`)
- Facilita a manutenção e organização do código

O Express utiliza um sistema de correspondência de URL e um mecanismo de middleware que processa sequencialmente as requisições.

**Referências:**

- [Express Router Guide](https://expressjs.com/en/guide/routing.html#express-router)
- [Modular Route Design](https://www.geeksforgeeks.org/express-js-express-router-function/)

## Tipos de Rotas

### Rotas Públicas vs. Privadas

Em nossa implementação do TaskFlow, existem dois tipos de rotas quanto à segurança:

**Rotas Públicas:** Acessíveis sem autenticação.

```
// POST /api/users - Criar um novo usuário (registro)
router.post("/", userController.createUser);
```

**Rotas Privadas:** Requerem autenticação e muitas vezes autorização.

```
// Usando middleware para proteger rotas
router.use(authMiddleware);
router.get("/", userController.getAllUsers); // Apenas usuários autenticados
```

**Por que separar?** A separação entre rotas públicas e privadas estabelece um perímetro de segurança claro. Algumas operações (como registro) precisam ser públicas, enquanto outras (como listar todos os usuários) precisam ser restritas.

### Rotas com Parâmetros

Parâmetros permitem que suas rotas sejam dinâmicas, capturando valores da URL:

```
// GET /api/users/42 - Obter usuário com ID 42
router.get("/:id", userController.getUserById);
```

O parâmetro `:id` captura qualquer valor naquela posição da URL e o disponibiliza como `req.params.id` no controlador.

**Por que usar?** Parâmetros de URL tornam suas rotas flexíveis e RESTful, permitindo operações específicas sobre recursos identificáveis.

### Rotas com Query Strings

Query strings são úteis para filtragem, ordenação e paginação:

```
// GET /api/users?page=2&limit=10
```

No controlador, acessados via `req.query.page` e `req.query.limit`.

**Por que usar?** Query strings são ideais para parâmetros opcionais que modificam o resultado mas não identificam recursos específicos.

### Rotas com Middlewares

Middlewares são funções que processam requisições antes do handler final:

```
router.put("/:id", validateUserInput, userController.updateUser);
```

**Por que usar?** Middlewares permitem:

- Validar dados de entrada antes de processá-los
- Verificar autenticação/autorização
- Registrar logs de atividade
- Tratar erros de forma centralizada

**Referências:**

- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)
- [Route Parameters in Express](https://expressjs.com/en/guide/routing.html#route-parameters)

## Boas Práticas

### Organização de Rotas

No TaskFlow, organizamos rotas seguindo princípios de modularidade:

1. **Separação por Domínio:** Rotas relacionadas a usuários ficam em `userRoutes.ts`, workspaces em `workspaceRoutes.ts`, etc.

2. **Estrutura em Camadas:**

   ```
   routes → controllers → services → repositories → database
   ```

   Esta estrutura direcional tem um propósito:

   - Cada camada tem responsabilidade única
   - O fluxo de dados segue um caminho previsível
   - Facilita testes unitários por camada

**Por que?** Esta organização traz benefícios tangíveis:

- Facilita encontrar código relacionado a um recurso
- Permite que múltiplos desenvolvedores trabalhem em paralelo
- Torna a aplicação escalável e manutenível

### Versionamento de API

Embora não implementado inicialmente no TaskFlow, o versionamento é crucial:

```
app.use("/api/v1/users", userRoutes);
```

**Por que versionar?** Permite evoluir sua API sem quebrar clientes existentes. Quando mudanças incompatíveis são necessárias, você cria uma nova versão, mantendo a antiga funcionando.

### Convenções de Nomenclatura

No TaskFlow, seguimos estas convenções:

- Rotas no plural (`/users` em vez de `/user`)
- Verbos HTTP adequados ao propósito (GET para leitura, POST para criação, etc.)
- URLs baseadas em recursos, não em ações

**Por que?** Consistência na nomenclatura torna sua API intuitiva e previsível para os desenvolvedores que a consumirão.

### Resposta Padronizada

Estruturas de resposta padronizadas melhoram a experiência de consumo da API:

- Status HTTP apropriados (201 para criação, 404 para não encontrado)
- Formato de erro consistente
- Respostas com estrutura previsível

**Referências:**

- [RESTful API Design](https://restfulapi.net/)
- [API Versioning Strategies](https://www.freecodecamp.org/news/rest-api-design-best-practices-build-a-rest-api/)

## Alternativas

### REST vs. GraphQL

Nossa implementação do TaskFlow segue princípios REST, onde cada endpoint corresponde a uma operação sobre um recurso.

**GraphQL seria diferente:**

- Um único endpoint (`/graphql`) para todas as operações
- Cliente especifica exatamente quais dados quer receber
- Consultas complexas em uma única requisição

**Quando escolher GraphQL?**

- Quando você precisa de flexibilidade no cliente para buscar dados
- Para aplicações com muitas entidades relacionadas
- Para reduzir múltiplas chamadas de API

**Quando manter REST?**

- Para APIs simples com estrutura clara
- Quando caching HTTP é importante
- Quando a performance de requisições individuais é crítica

### Framework Express vs. NestJS

O TaskFlow usa Express diretamente, mas NestJS ofereceria uma abordagem diferente:

**NestJS:**

- Estrutura opinativa baseada em decoradores
- Injeção de dependência integrada
- Módulos, Controllers e Services como conceitos fundamentais

```
@Controller('users')
export class UsersController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    // Implementação
  }
}
```

**Por que escolher Express?**

- Mais simples e direto
- Menos abstração, mais flexibilidade
- Mais leve e com maior comunidade

**Por que escolher NestJS?**

- Estrutura mais rigidamente organizada
- Melhor para equipes grandes
- Mais features integradas (validação, autenticação, etc)

### API Serverless

Uma abordagem serverless (como AWS Lambda + API Gateway) diferiria:

```
// Formato conceitual
export const handler = async (event) => {
  // O event contém detalhes da requisição HTTP
  // Realizar operação e retornar resposta
};
```

**Quando considerar serverless?**

- Para cargas de trabalho intermitentes
- Para reduzir custos operacionais
- Para escalar automaticamente

**Por que manter abordagem tradicional?**

- Para aplicações com uso constante
- Para maior controle sobre o ambiente
- Para evitar cold starts em aplicações sensíveis à latência

**Referências:**

- [GraphQL vs REST](https://www.apollographql.com/blog/graphql-vs-rest/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Serverless API Design](https://www.serverless.com/blog/serverless-api-gateway-rest-api)

## Implementação Completa de Usuários

Aqui detalhamos a implementação completa do módulo de usuários, seguindo nossa arquitetura em camadas.

### 1. Definição dos Tipos/Interfaces (Models)

```typescript
// src/models/user.ts

export interface User {
  id: number;
  email: string;
  name: string | null;
  passwordHash: string;
  avatar: string | null;
  provider: string | null;
  providerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
}

export interface CreateUserDto {
  email: string;
  name?: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
  createdAt: Date;
  emailVerified: boolean;
}
```

### 2. Repositório de Usuário (Acesso ao Banco)

```typescript
// src/repositories/userRepository.ts

import { db } from "../db";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";
import { CreateUserDto, UpdateUserDto, User } from "../models/user";

export const userRepository = {
  findById: async (id: number): Promise<User | undefined> => {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result[0];
  },

  findByEmail: async (email: string): Promise<User | undefined> => {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0];
  },

  create: async (userData: {
    email: string;
    passwordHash: string;
    name?: string | null;
  }): Promise<User> => {
    const result = await db.insert(users).values(userData).returning();

    return result[0];
  },

  update: async (
    id: number,
    userData: UpdateUserDto
  ): Promise<User | undefined> => {
    const result = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return result[0];
  },

  delete: async (id: number): Promise<boolean> => {
    const result = await db.delete(users).where(eq(users.id, id));

    return true;
  },

  findAll: async (page: number = 1, limit: number = 10): Promise<User[]> => {
    const offset = (page - 1) * limit;

    const result = await db.select().from(users).limit(limit).offset(offset);

    return result;
  },
};
```

### 3. Serviço de Usuário (Lógica de Negócio)

```typescript
// src/services/userService.ts

import bcrypt from "bcrypt";
import { userRepository } from "../repositories/userRepository";
import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserResponse,
} from "../models/user";

// Função auxiliar para converter User em UserResponse (remover dados sensíveis)
const toUserResponse = (user: User): UserResponse => ({
  id: user.id,
  email: user.email,
  name: user.name,
  avatar: user.avatar,
  createdAt: user.createdAt,
  emailVerified: user.emailVerified,
});

export const userService = {
  registerUser: async (userData: CreateUserDto): Promise<UserResponse> => {
    // Verificar se o email já existe
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(userData.password, 10);

    // Criar usuário no banco
    const user = await userRepository.create({
      email: userData.email,
      passwordHash,
      name: userData.name || null,
    });

    return toUserResponse(user);
  },

  getUserById: async (id: number): Promise<UserResponse> => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    return toUserResponse(user);
  },

  updateUser: async (
    id: number,
    updateData: UpdateUserDto
  ): Promise<UserResponse> => {
    // Verificar se o usuário existe
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Verificar se o email está sendo alterado e se já está em uso
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await userRepository.findByEmail(updateData.email);
      if (emailExists) {
        throw new Error("Email already in use");
      }
    }

    // Atualizar o usuário
    const updatedUser = await userRepository.update(id, updateData);
    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return toUserResponse(updatedUser);
  },

  deleteUser: async (id: number): Promise<void> => {
    // Verificar se o usuário existe
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    await userRepository.delete(id);
  },

  getAllUsers: async (
    page: number = 1,
    limit: number = 10
  ): Promise<UserResponse[]> => {
    const users = await userRepository.findAll(page, limit);
    return users.map(toUserResponse);
  },

  // Método adicional para autenticação de usuário
  validateUser: async (
    email: string,
    password: string
  ): Promise<{ user: UserResponse; userId: number }> => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    return {
      user: toUserResponse(user),
      userId: user.id,
    };
  },
};
```

### 4. Controlador de Usuário (Interface HTTP)

```typescript
// src/controllers/userController.ts

import { Request, Response } from "express";
import { userService } from "../services/userService";

export const userController = {
  createUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, name, password } = req.body;

      // Validação básica
      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      const user = await userService.registerUser({ email, name, password });
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  getUserById: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
      }

      const user = await userService.getUserById(userId);
      res.status(200).json(user);
    } catch (error: any) {
      if (error.message === "User not found") {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  },

  updateUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
      }

      const updateData = {
        name: req.body.name,
        email: req.body.email,
        avatar: req.body.avatar,
      };

      // Remover campos undefined
      Object.keys(updateData).forEach((key) => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      const user = await userService.updateUser(userId, updateData);
      res.status(200).json(user);
    } catch (error: any) {
      if (error.message === "User not found") {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(400).json({ message: error.message });
    }
  },

  deleteUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
      }

      await userService.deleteUser(userId);
      res.status(204).end();
    } catch (error: any) {
      if (error.message === "User not found") {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  },

  getAllUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const users = await userService.getAllUsers(page, limit);
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
```

### 5. Rotas de Usuário

```typescript
// src/routes/userRoutes.ts

import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Rotas públicas
router.post("/", userController.createUser);

// Rotas protegidas (precisam de autenticação)
router.use(authMiddleware);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
```

### 6. Serviço de Autenticação

```typescript
// src/services/authService.ts

import jwt from "jsonwebtoken";
import { userService } from "./userService";

export const authService = {
  login: async (email: string, password: string) => {
    // Validar credenciais do usuário
    const { user, userId } = await userService.validateUser(email, password);

    // Gerar token JWT com ID do usuário
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    // Gerar refresh token
    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d" }
    );

    return { user, token, refreshToken };
  },

  refreshToken: async (refreshToken: string) => {
    try {
      // Verificar refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET as string
      ) as { userId: number };

      // Buscar usuário
      const user = await userService.getUserById(decoded.userId);

      // Gerar novo token
      const newToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      return { user, token: newToken };
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  },
};
```

### 7. Controlador de Autenticação

```typescript
// src/controllers/authController.ts

import { Request, Response } from "express";
import { authService } from "../services/authService";

export const authController = {
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      const { user, token, refreshToken } = await authService.login(
        email,
        password
      );

      res.status(200).json({ user, token, refreshToken });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },

  refresh: async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ message: "Refresh token is required" });
        return;
      }

      const { user, token } = await authService.refreshToken(refreshToken);

      res.status(200).json({ user, token });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },
};
```

### 8. Rotas de Autenticação

```typescript
// src/routes/authRoutes.ts

import { Router } from "express";
import { authController } from "../controllers/authController";

const router = Router();

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

export default router;
```

## Middleware de Autenticação Multi-Tenant

O middleware de autenticação com suporte a multi-tenancy é uma peça crítica para nossa arquitetura, pois permite que o mesmo usuário acesse diferentes workspaces (tenants) com diferentes permissões.

```typescript
// src/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository";
import { workspaceMembersRepository } from "../repositories/workspaceMembersRepository";

// Estender o tipo Request para incluir informações do usuário e tenant
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        name: string | null;
      };
      tenant?: {
        workspaceId: number | null;
        role: string | null;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Verificar se o token está presente no header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    // 2. Extrair e verificar o token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
      workspaceId?: number;
    };

    // 3. Buscar o usuário no banco de dados
    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // 4. Adicionar informações do usuário ao objeto request
    req.user = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    // 5. Multi-Tenancy: Verificar informações do workspace (tenant)
    req.tenant = { workspaceId: null, role: null };

    // 5.1 Verificar se há um workspaceId no token (mais comum)
    if (decoded.workspaceId) {
      const membership =
        await workspaceMembersRepository.findByUserAndWorkspace(
          user.id,
          decoded.workspaceId
        );

      if (membership) {
        req.tenant = {
          workspaceId: decoded.workspaceId,
          role: membership.role,
        };
      }
    }
    // 5.2 Alternativa: Verificar workspaceId de um header específico
    else if (req.headers["x-workspace-id"]) {
      const workspaceId = parseInt(req.headers["x-workspace-id"] as string);

      if (!isNaN(workspaceId)) {
        const membership =
          await workspaceMembersRepository.findByUserAndWorkspace(
            user.id,
            workspaceId
          );

        if (membership) {
          req.tenant = {
            workspaceId,
            role: membership.role,
          };
        }
      }
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
```

### Repositório de Membros de Workspace

Para o middleware acima funcionar, precisamos de um repositório que verifique membros de workspaces:

```typescript
// src/repositories/workspaceMembersRepository.ts

import { db } from "../db";
import { workspaceMembers } from "../db/schema/workspace_members";
import { eq, and } from "drizzle-orm";

export const workspaceMembersRepository = {
  findByUserAndWorkspace: async (userId: number, workspaceId: number) => {
    const result = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.userId, userId),
          eq(workspaceMembers.workspaceId, workspaceId)
        )
      )
      .limit(1);

    return result[0];
  },
};
```

## Conceito de Multi-Tenancy

Multi-tenancy é um conceito arquitetural onde uma única instância de um software serve múltiplos clientes isolados, chamados "tenants". No contexto do TaskFlow:

### O que é um Tenant?

Em nossa aplicação, um **tenant** é um workspace. Cada workspace:

- Contém seus próprios recursos (tarefas, comentários, etc.)
- Tem seus próprios membros com diferentes permissões
- Mantém isolamento de dados em relação a outros workspaces

### Por que Multi-Tenancy é Importante?

1. **Isolamento de dados**: Os dados de um workspace não são visíveis para usuários de outros workspaces.
2. **Controle de acesso granular**: Um usuário pode ter diferentes níveis de permissão em diferentes workspaces.
3. **Escalonamento**: Permite que a aplicação sirva muitos clientes/organizações sem duplicar toda a infraestrutura.

### Como o TaskFlow Implementa Multi-Tenancy

O TaskFlow utiliza uma abordagem de **multi-tenancy baseado em dados**, onde:

1. Todos os tenants (workspaces) compartilham:

   - O mesmo código de aplicação
   - A mesma instância de banco de dados
   - O mesmo esquema de banco de dados

2. O isolamento é implementado através de:
   - Relacionamentos no banco de dados (cada recurso está ligado a um workspace específico)
   - Middleware de autenticação que verifica permissões no workspace
   - Filtros em todas as queries que incluem o workspaceId

### Fluxo de Autenticação Multi-Tenant

1. O usuário se autentica com email/senha e recebe um token JWT
2. Para acessar recursos de um workspace específico:
   - O cliente envia o token JWT + workspaceId (em header ou requisição)
   - O middleware verifica se o usuário pertence àquele workspace e qual seu papel
   - O serviço filtra dados com base no workspaceId e nas permissões

### Benefícios da Abordagem Escolhida

1. **Simplicidade**: Uma única instância de aplicação para todos os tenants
2. **Flexibilidade**: Usuários podem pertencer a múltiplos workspaces
3. **Eficiência**: Recursos computacionais compartilhados entre tenants
4. **Manutenção**: Atualizações e correções aplicadas uma única vez para todos os tenants

**Referências:**

- [Multi-Tenant Data Architecture](https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/considerations/data-considerations)
- [Multi-Tenancy in RESTful APIs](https://nordicapis.com/building-a-multi-tenant-api/)
- [SaaS Multi-Tenant Patterns](https://medium.com/@vittorio.zaccaria/saas-multi-tenant-patterns-and-resources-4f78ddd5aca7)
