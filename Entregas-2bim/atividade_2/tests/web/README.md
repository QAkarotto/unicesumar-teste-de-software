# Testes Web

Pasta reservada para os futuros testes de interface do front-end do ServeRest
(https://front.serverest.dev), executados pelo projeto `web` do `playwright.config.ts`.

Convenções sugeridas:

- arquivos de teste em `tests/web/*.spec.ts`;
- page objects em `tests/web/pages/`;
- usar `page.goto('/')` — a `baseURL` já aponta para o front do ServeRest.

Antes de rodar testes Web pela primeira vez, instale o navegador:

```bash
npx playwright install chromium
npm run test:web
```
