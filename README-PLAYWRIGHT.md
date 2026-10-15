# Automação de Testes de API com Playwright

## Descrição

Projeto desenvolvido para a Atividade 01 do 2º bimestre da disciplina de Testes de Software, utilizando Playwright e TypeScript para automatizar testes da API ServeRest.

## Tecnologias

- Node.js
- TypeScript
- Playwright
- API ServeRest: https://serverest.dev/

## Estrutura

- `tests/api/` — testes automatizados da API.
- `tests/web/` — estrutura reservada para futuros testes Web.
- `playwright.config.ts` — configuração do Playwright.
- `package.json` — dependências e comandos do projeto.

## Instalação

```bash
npm install
```

## Executar todos os testes

```bash
npx playwright test
```

## Executar somente os testes de API

```bash
npx playwright test --project=api
```

## Cenários automatizados

1. Consultar lista de usuários.
2. Consultar lista de produtos.
3. Cadastrar usuário válido.
4. Rejeitar cadastro com e-mail duplicado.
5. Rejeitar cadastro sem nome.
6. Rejeitar consulta com ID inexistente.
7. Rejeitar login com credenciais inválidas.
8. Autenticar usuário cadastrado.

## Evidência

Os testes foram executados utilizando GitHub Actions, com resultado de 8 testes aprovados e nenhuma falha.

A execução pode ser consultada na aba Actions do repositório.
