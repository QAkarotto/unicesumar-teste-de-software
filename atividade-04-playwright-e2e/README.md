# Atividade 04 - Testes E2E com Playwright

Disciplina: Projeto, Implementação e Teste de Software

**Integrantes:**
- Severo Junior
- Bruno Laroca Rosa

## Objetivo

Automatizar testes End-to-End no frontend do ServeRest utilizando Playwright e TypeScript.

## Cenários implementados

1. Cadastro e autenticação de usuário pela interface.
2. Cadastro e listagem de produto por administrador, utilizando fixture personalizada com `test.extend()`.
3. Tentativa de login com credenciais inválidas.

## Tecnologias

- Playwright
- TypeScript
- Chromium
- ServeRest Front

## Como executar

Dentro da pasta da atividade, execute:

```bash
npm install
npx playwright install chromium
npx playwright test
```

Para acompanhar os testes no navegador:

```bash
npx playwright test --headed
```

## Organização

- `tests/`: cenários E2E.
- `fixtures/`: fixture de autenticação do administrador.
- `playwright.config.ts`: configuração dos testes.
- `produto.png`: imagem utilizada no cadastro de produtos.
- `evidencias/`: print da execução dos testes.

## Resultado

Os três cenários foram executados com sucesso no Chromium em modo headless.

**Resultado: 3 passed.**