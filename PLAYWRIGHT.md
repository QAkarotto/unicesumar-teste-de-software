# Testes Automatizados com Playwright

Testes automatizados de API para o [ServeRest](https://serverest.dev/) usando [Playwright](https://playwright.dev/) com TypeScript. A mesma estrutura já está preparada para futuros testes Web.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm

## Estrutura

```
.
├── package.json
├── playwright.config.ts   # Projetos "api" e "web"
├── tsconfig.json
└── tests/
    ├── api/               # Testes de API do ServeRest
    │   ├── helpers.ts
    │   ├── login.spec.ts
    │   ├── produtos.spec.ts
    │   └── usuarios.spec.ts
    └── web/               # Estrutura reservada para futuros testes Web
```

## Instalação

```bash
npm install
```

> Os testes de API não precisam de navegador. Para os futuros testes Web, instale os navegadores com `npx playwright install`.

## Execução

| Comando | Descrição |
| --- | --- |
| `npx playwright test` | Executa todos os testes |
| `npx playwright test --project=api` | Executa apenas os testes de API |
| `npx playwright test --project=web` | Executa apenas os testes Web |
| `npx playwright show-report` | Abre o relatório HTML da última execução |

Os mesmos comandos estão disponíveis como scripts: `npm test`, `npm run test:api`, `npm run test:web` e `npm run report`.

## Cenários de API

| Arquivo | Cenário | Status esperado |
| --- | --- | --- |
| `usuarios.spec.ts` | Lista usuários e valida que `quantidade` é igual ao total retornado | 200 |
| `usuarios.spec.ts` | Cadastra um novo usuário | 201 |
| `usuarios.spec.ts` | Impede cadastro com e-mail já utilizado (regra de negócio) | 400 |
| `usuarios.spec.ts` | Busca usuário por ID e valida os dados cadastrados | 200 |
| `login.spec.ts` | Login com credenciais válidas retorna token `Bearer` | 200 |
| `login.spec.ts` | Login com senha inválida | 401 |
| `produtos.spec.ts` | Cadastro de produto sem token de autenticação | 401 |
| `produtos.spec.ts` | Usuário não administrador não pode cadastrar produto (regra de negócio) | 403 |

Os dados de teste são gerados dinamicamente (e-mails e nomes únicos), e os usuários criados são excluídos ao final dos testes.
