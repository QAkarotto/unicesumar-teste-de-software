# Testes automatizados com Playwright — ServeRest

Projeto de testes com **Playwright + TypeScript** para a API do [ServeRest](https://serverest.dev/),
já preparado para futuros testes Web.

## Estrutura

```
tests/
├── api/            # testes de API (usuários, login, produtos)
│   └── helpers/    # funções de apoio (massa de dados, login, limpeza)
└── web/            # reservado para testes Web (projeto "web" já configurado)
playwright.config.ts
package.json
```

## Pré-requisitos

- Node.js 20 ou superior

## Instalação

```bash
npm install
```

> Os testes de API **não precisam** de navegadores. Para os testes Web (futuro), rode uma vez:
> `npm run install:browsers`.

## Execução

| Comando                | O que faz                                   |
|------------------------|---------------------------------------------|
| `npx playwright test`  | Executa todos os projetos                   |
| `npm run test:api`     | Executa **apenas** os testes de API         |
| `npm run test:web`     | Executa apenas os testes Web (quando existirem) |
| `npm run test:report`  | Abre o relatório HTML da última execução    |

Equivalente sem script: `npx playwright test --project=api`.

## Configuração

URLs podem ser sobrescritas por variáveis de ambiente:

```bash
API_URL=https://serverest.dev WEB_URL=https://front.serverest.dev npx playwright test --project=api
```

## Cenários de API cobertos (11 testes)

- **Usuários:** cadastro com sucesso; consulta por ID; e-mail duplicado (regra de negócio); cadastro sem e-mail (inválido); ID inexistente (inválido).
- **Login:** login válido com token Bearer; senha incorreta (inválido).
- **Produtos:** admin cadastra e consulta produto; não-admin recebe 403 (regra de negócio); sem token recebe 401 (inválido); nome duplicado (regra de negócio).

Cada teste cria sua própria massa de dados (e-mails/nomes únicos) e remove o que criou.
