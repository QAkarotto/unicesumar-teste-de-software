
# Automação de Testes com Playwright

Testes automatizados da API ServeRest desenvolvidos em TypeScript utilizando Playwright.

## Instalação

Na raiz do repositório, executar:

```bash
npm install
```

## Execução

Executar todos os testes:

```bash
npx playwright test
```

Executar apenas os testes de API:

```bash
npx playwright test --project=api
```

Ou utilizar:

```bash
npm run test:api
```

## Organização

- `tests/api`: testes automatizados de usuários, login e produtos.
- `tests/data/factories.ts`: geração de dados com Faker.
- `tests/helpers/auth.ts`: autenticação e obtenção do token.
- `tests/helpers/api.ts`: requisições reutilizáveis.
- `tests/web`: pasta reservada para futuros testes Web.
- `playwright.config.ts`: configuração compartilhada do Playwright.

## Melhorias realizadas

- Organização dos testes por responsabilidade.
- Geração dinâmica de usuários e produtos utilizando Faker.
- Reutilização das funções de autenticação e requisições.
- Testes independentes com preparação e limpeza dos dados.
- Validação de status HTTP, respostas e regras de negócio.

A suíte possui 12 testes de API, incluindo cenários válidos e inválidos.

Os testes utilizam o serviço público `https://serverest.dev/` e precisam de acesso à internet.
