# Atividade 02 — Evolução da Suíte de Testes de API com Playwright

Disciplina: Teste de Software — Engenharia de Software — UniCesumar  
Integrantes: Luiz Gustavo Becher Bolzani e Jefferson Luis Namur Junior.

## Objetivo
Refatorar a suíte de API ServeRest com configurações centralizadas, helpers, fixture de autenticação, factories com Faker, independência entre testes, limpeza e asserções completas.

## Requisitos
Node.js 20+ e npm.

## Instalação e execução
```bash
npm install
npx playwright test
npm run test:api
npx playwright test tests/api
npx playwright show-report
```

## Estrutura
- `tests/api`: 12 cenários de API, sem testes de interface.
- `tests/helpers`: operações comuns de API e login.
- `tests/fixtures`: fixture de usuário administrador com teardown.
- `tests/data`: factories Faker para dados únicos.
- `playwright.config.ts`: baseURL, timeout, retries e relatórios.

## Observações
A suíte utiliza a API pública `https://serverest.dev/`, portanto exige internet e pode ser afetada por instabilidade do serviço. A execução ainda deve ser validada no Codespaces. Os testes são isolados e utilizam limpeza `finally` ou teardown.

## Integração no repositório da disciplina
**Não substitua automaticamente arquivos de configuração existentes.** Compare `package.json`, `playwright.config.ts` e `tsconfig.json` com os da branch master. Copie apenas os arquivos novos e integre configurações preservando as existentes. Execute a suíte antes de abrir o PR.
