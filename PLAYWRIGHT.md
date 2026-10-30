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

- `tests/api`: testes automatizados da API ServeRest.
- `tests/web`: pasta reservada para futuros testes Web.
- `playwright.config.ts`: configuração do Playwright.

Os testes verificam status HTTP, dados das respostas e regras de negócio, como o bloqueio de e-mail duplicado. Os usuários criados nos testes são identificados por e-mails únicos para evitar conflitos.

Os testes de API utilizam o serviço público `https://serverest.dev/` e precisam de acesso à internet.
