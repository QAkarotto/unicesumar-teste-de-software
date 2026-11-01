# Testes E2E — ServeRest

## Objetivo

Automatizar os principais fluxos da aplicação Web ServeRest utilizando Playwright e TypeScript.

## Cenários automatizados

1. **Cadastro e autenticação de usuário:** realiza o cadastro pela interface, encerra a sessão e autentica novamente com as credenciais cadastradas.
2. **Cadastro de produto:** utiliza uma fixture personalizada com `test.extend()` para preparar um administrador, cadastra um produto pela interface e verifica os dados na listagem.
3. **Login inválido:** verifica a mensagem de erro e confirma que o acesso à área autenticada não foi permitido.

## Tecnologias

- Playwright
- TypeScript
- Faker
- ServeRest Web: https://front.serverest.dev/
- ServeRest API: https://serverest.dev/

## Pré-requisitos

Instalar as dependências:

```bash
npm install
```

Instalar o navegador Chromium:

```bash
npx playwright install chromium
```

## Execução

Executar os testes Web:

```bash
npm run test:web
```

Verificar os tipos TypeScript:

```bash
npm run typecheck
```

Abrir o relatório HTML:

```bash
npm run test:report
```

## Resultado

Os três cenários automatizados foram executados com sucesso, com 3 testes aprovados.