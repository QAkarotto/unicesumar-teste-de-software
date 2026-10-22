# Testes Web (futuro)

Esta pasta está reservada para os testes de interface.
O projeto `web` já está configurado em `playwright.config.ts`
(Chromium, `baseURL` = https://front.serverest.dev, screenshot em falha e trace no retry).

Para adicionar testes, crie arquivos `*.spec.ts` aqui e rode:

```bash
npm run install:browsers   # uma única vez
npm run test:web
```

Sugestão: organizar Page Objects em `tests/web/pages/`.
