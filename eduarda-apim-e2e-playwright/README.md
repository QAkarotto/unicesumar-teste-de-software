# Testes E2E – ServeRest Front (Playwright)

Testes automatizados E2E para <https://front.serverest.dev/> usando `@playwright/test` (JavaScript).

## Pré-requisitos
- Node.js 18+

## Instalação
```bash
npm install
npx playwright install chromium
```

## Execução
```bash
npm test              # headless; gera relatório HTML e JSON
npm run test:headed   # com navegador visível
npm run test:ui       # modo UI do Playwright
npm run report        # abre o relatório HTML (playwright-report/)
npx playwright test tests/e2e/03-login-invalido.spec.js   # um arquivo
```

## Estrutura
```
tests/
  e2e/
    01-cadastro-e-login.spec.js        # Cenário 1
    02-cadastro-produto-admin.spec.js  # Cenário 2
    03-login-invalido.spec.js          # Cenário 3
  fixtures/auth.js                     # test.extend(): admin + adminPage
  support/dados.js                     # geração de dados únicos
  support/paginas.js                   # ações de UI reutilizáveis
evidencias/                            # resultado.json e prints da execução
```

## Decisões
- **Seletores:** `getByTestId()` (atributo `data-testid`); texto/role só onde não há testid (mensagens, linhas da tabela).
- **Fixture:** `admin` cria o administrador via API (pré-condição) e o remove ao final; `adminPage` faz o login pela UI e entrega a página autenticada.
- **Dados únicos:** e-mail e nome de produto com timestamp + número aleatório.
- **Independência:** cada teste cria seus próprios dados; podem rodar em paralelo e em qualquer ordem.
- **Sem esperas fixas:** apenas auto-wait e asserções web-first (`expect(...).toBeVisible()`, `toHaveURL()`).

## Evidência da execução
Ver a pasta `evidencias/` (saída do terminal, `resultado.json` e captura do relatório HTML).
