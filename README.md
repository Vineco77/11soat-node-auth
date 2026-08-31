# 🔐 Auth Service - Microserviço de Autenticação.

[![Code Coverage](https://img.shields.io/badge/coverage-99.77%25-brightgreen)](https://sonarcloud.io/summary/overall?id=Vineco77_11soat-node-auth&branch=main)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748.svg)](https://www.prisma.io/)

## 📋 Descrição

Microserviço de autenticação desenvolvido com NestJS, que pode ser utilizado tanto como **API REST** quanto como **biblioteca npm** (`@vineco77/auth-lib`). Implementa autenticação JWT com suporte a dois tipos de usuários: **clientes** e **funcionários**.

### 🎯 Funcionalidades

- ✅ Geração de tokens JWT para clientes e funcionários
- ✅ Validação de tokens JWT
- ✅ Gestão de funcionários (CRUD)
- ✅ Validação de CPF
- ✅ Suporte a uso como API ou biblioteca
- ✅ Arquitetura Clean Architecture
- ✅ Testes BDD com Cucumber
- ✅ Cobertura de testes acima de 80%

---

## 📊 Evidências de Cobertura de Testes

### Microsserviço Auth Service

**Cobertura Total: 97.16%**

| Métrica | Cobertura | Status |
|---------|-----------|--------|
| **Statements** | 261/262 (99.61%) | ✅ |
| **Branches** | 61/61 (100%) | ✅ |
| **Functions** | 57/58 (98.27%) | ✅ |
| **Lines** | 237/238 (99.57%) | ✅ |

#### Detalhamento por Módulo:

| Módulo | Statements | Branches | Functions | Lines |
|--------|-----------|----------|-----------|-------|
| **Auth Library** | 100% | 100% | 100% | 100% |
| **Use Cases** | 100% | 100% | 100% | 100% |
| **Controllers** | 100% | 0% | 100% | 100% |
| **Repositories** | 100% | 100% | 100% | 100% |
| **Services** | 100% | 100% | 100% | 100% |
| **Domain** | 100% | 100% | 100% | 100% |
| **CPF Validator** | 96.96% | 100% | 87.5% | 96.77% |

### 📸 Evidência Visual

Para visualizar o relatório completo de cobertura, execute:

```bash
npm run test:coverage
```

O relatório HTML estará disponível em: `coverage/lcov-report/index.html`

**Screenshot do Coverage Summary:**

```
=============================== Coverage summary ===============================
Statements   : 99.61% ( 261/262 )
Branches     : 100% ( 61/61 )
Functions    : 98.27% ( 57/58 )
Lines        : 99.57% ( 237/238 )
================================================================================
```

---

## 🚀 Formas de Uso

### 1️⃣ Como API REST

#### Requisitos
- Node.js 20+
- Docker e Docker Compose
- PostgreSQL 15

#### Instalação

```bash
# Clone o repositório
git clone https://github.com/Vineco77/auth-service-fase-4.git
cd auth-service-fase-4

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Suba o banco de dados com Docker
npm run docker:up

# Execute as migrações
npm run prisma:migrate

# Inicie o servidor
npm run start:dev
```

#### Endpoints Disponíveis

A documentação Swagger está disponível em: `http://localhost:1337/api`

**Auth Controller** (`/auth`)
- `POST /auth/token` - Gera token JWT
  ```json
  {
    "cpf": "12345678900" // opcional
  }
  ```

**Validate Controller** (`/validate`)
- `POST /validate/token` - Valida token JWT
  ```json
  {
    "token": "eyJhbGc..."
  }
  ```

**Employees Controller** (`/employees`)
- `POST /employees` - Cria funcionário
  ```json
  {
    "cpf": "12345678900",
    "name": "João Silva",
    "email": "joao@email.com"
  }
  ```
- `DELETE /employees/:cpf` - Remove funcionário

---

### 2️⃣ Como Biblioteca NPM

#### Instalação

```bash
npm install @vineco77/auth-lib
```

#### Uso Básico

```typescript
import { AuthLib, JwtService } from '@vineco77/auth-lib';

// Usando AuthLib (classe principal)
const authLib = new AuthLib();

// Gerar token
const token = authLib.generateToken({
  sub: 'user-id',
  type: 'client',
  cpf: '12345678900' // opcional
});

// Validar token
const payload = authLib.validateToken(token);

// Usando JwtService diretamente
const jwtService = new JwtService();
const customToken = jwtService.sign({ userId: '123' }, 'secret-key', { expiresIn: '1h' });
const decoded = jwtService.verify(customToken, 'secret-key');
```

---

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture**:

```
src/
├── core/                      # Regras de negócio
│   ├── application/
│   │   ├── use-cases/        # Casos de uso
│   │   └── ports/            # Interfaces
│   └── domain/
│       ├── entities/         # Entidades de domínio
│       ├── errors/           # Erros de domínio
│       └── value-objects/    # Objetos de valor
├── drivers/                   # Adaptadores de entrada
│   ├── application/
│   │   ├── controllers/      # Controllers NestJS
│   │   └── dtos/             # DTOs
│   └── shared/               # Utilitários compartilhados
└── infrastructure/            # Adaptadores de saída
    ├── adapters/
    │   ├── persistence/      # Repositórios
    │   └── services/         # Serviços externos
    └── config/               # Configurações
```

---

## 🧪 Testes

### Tipos de Testes

1. **Testes Unitários**
```bash
npm test
```

2. **Testes BDD (Behavior Driven Development)**
```bash
npm run test:bdd
```

3. **Cobertura de Testes**
```bash
npm run test:coverage
```

4. **Testes em modo watch**
```bash
npm run test:watch
```

### Estrutura de Testes BDD

Os testes BDD seguem a metodologia Cucumber:

```
bdd/
├── features/              # Cenários em Gherkin
│   ├── auth/
│   │   ├── token-generation.feature
│   │   └── token-validation.feature
│   └── employees/
│       ├── create-employee.feature
│       └── delete-employee.feature
└── step-definitions/      # Implementação dos steps
```

**Exemplo de Feature:**

```gherkin
Feature: Token Generation
  As a system user
  I want to generate JWT tokens
  So that I can authenticate my requests

  Scenario: Generate client token without CPF
    Given I am a user with valid client data
    When I generate a JWT token
    Then I should receive a valid token
    And the token should have client type
```

---

## 🔧 Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas

### Testes
- **Jest** - Framework de testes
- **Jest-Cucumber** - Testes BDD
- **Supertest** - Testes de integração

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **SonarQube** - Análise de código

---

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia em modo desenvolvimento
npm run start:debug        # Inicia em modo debug

# Build
npm run build              # Compila o projeto
npm run build:lib          # Compila a biblioteca
npm run build:all          # Compila projeto + biblioteca

# Testes
npm test                   # Executa testes unitários
npm run test:watch         # Testes em modo watch
npm run test:coverage      # Gera cobertura de testes
npm run test:bdd           # Executa testes BDD
npm run test:bdd:coverage  # Cobertura dos testes BDD

# Banco de Dados
npm run prisma:generate    # Gera Prisma Client
npm run prisma:migrate     # Executa migrações
npm run prisma:studio      # Abre Prisma Studio

# Docker
npm run docker:up          # Sobe containers
npm run docker:down        # Derruba containers

# Qualidade de Código
npm run sonar              # Executa análise SonarQube
```

---

## 🐳 Docker

### Desenvolvimento

```bash
# Subir apenas o banco de dados
npm run docker:up

# Parar e limpar containers
npm run docker:down
```

### Produção

```bash
# Build da imagem
docker build -t auth-service .

# Executar com Docker Compose
docker-compose up -d
```

O serviço estará disponível em: `http://localhost:1337`

---

## 📝 Modelo de Dados

### User (Employee)

```prisma
model User {
  id        String   @id @default(uuid())
  cpf       String   @unique
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🔐 Tipos de Token

### Cliente (Client)
- Gerado sem CPF ou com CPF não cadastrado como funcionário
- Usado para autenticação de clientes do sistema

```json
{
  "sub": "client-uuid",
  "type": "client",
  "cpf": "12345678900", // opcional
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Funcionário (Employee)
- Gerado com CPF cadastrado no sistema
- Possui permissões adicionais

```json
{
  "sub": "employee-uuid",
  "type": "employee",
  "cpf": "12345678900",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## 📚 Biblioteca Auth-Lib

A biblioteca pode ser publicada e usada em outros projetos:

```bash
# Build da biblioteca
npm run build:lib

# Publicar (configure o registry antes)
npm run publish:lib
```

### Interfaces Exportadas

```typescript
export interface JwtPayload {
  sub: string;
  type: 'client' | 'employee';
  cpf?: string;
  iat?: number;
  exp?: number;
}
```

---

## 👥 Autores

- **Vinicius Ribeiro** - [Vineco77](https://github.com/Vineco77)

---

## 📄 Licença

Este projeto foi desenvolvido como parte do trabalho acadêmico da FIAP - Fase 4.

---

## ✅ Status do Projeto

✅ **Concluído** - Versão 1.0.0

- [x] Autenticação JWT
- [x] Gestão de funcionários
- [x] Validação de CPF
- [x] Testes unitários e BDD
- [x] Cobertura > 99%
- [x] Documentação Swagger
- [x] Docker e Docker Compose
- [x] Biblioteca npm publicável
- [x] Clean Architecture

---

**Collections para testes**: [Collection Auth](https://drive.google.com/file/d/1ttZMUOixYpXEVzg344jcZqjLcuhfRCHy/view?usp=sharing)  

**Desenvolvido com ❤️**


<!-- Security scan triggered at 2026-08-31 18:24:16 -->