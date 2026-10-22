# Testes automatizados com Playwright — ServeRest

Projeto de testes com **Playwright + TypeScript** para a API do [ServeRest](https://serverest.dev/),
já preparado para futuros testes Web.

## Estrutura

```
tests/
├── api/            # specs: apenas cenários e verificações (usuarios, login, produtos, carrinhos)
├── helpers/
│   ├── api.ts      # requisições reutilizáveis (usuários, produtos, carrinhos)
│   └── auth.ts     # login, obtenção de token e preparação de sessão
├── fixtures/
│   └── api.fixture.ts  # fixtures: usuario, admin, comum, criarProduto, criarCarrinho (com limpeza)
├── data/
│   └── factories.ts    # geração de dados dinâmicos com Faker
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

Equivalentes sem script: `npx playwright test --project=api` ou `npx playwright test tests/api`.

## Configuração

URLs podem ser sobrescritas por variáveis de ambiente:

```bash
API_URL=https://serverest.dev WEB_URL=https://front.serverest.dev npx playwright test --project=api
```

## Cenários de API cobertos (21 testes)

- **Usuários:** cadastro com dados dinâmicos + consulta; consulta por ID; e-mail duplicado (regra de negócio); cadastro sem e-mail (inválido); ID inexistente (inválido); exclusão e confirmação de que o recurso deixou de existir.
- **Login:** login válido com token Bearer; senha incorreta; e-mail não cadastrado (inválidos).
- **Produtos:** exige token (401); não-admin recebe 403; admin cadastra e consulta; preço inválido; nome duplicado; atualização refletida na consulta.
- **Carrinhos:** exige token (401); totais, itens e dono do carrinho; baixa de estoque; quantidade acima do estoque; só um carrinho por usuário; cancelar compra reabastece o estoque.

## Boas práticas aplicadas

- **Independência:** cada teste monta suas pré-condições por fixtures; não há dependência de ordem.
- **Dados dinâmicos:** e-mails, nomes, preços e descrições gerados com `@faker-js/faker` (`tests/data/factories.ts`).
- **Limpeza:** o teardown das fixtures remove carrinhos, produtos e usuários criados.
- **Configuração central:** URLs e opções comuns em `playwright.config.ts`; os testes usam só caminhos relativos.
