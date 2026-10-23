
# Testes de API com Playwright e TypeScript

## Objetivo

Projeto de testes automatizados da API ServeRest utilizando
Playwright Test e TypeScript.

## Tecnologias

- Node.js
- npm
- TypeScript
- Playwright Test
- ServeRest

## Estrutura

```text
tests/
├── api/
│   ├── usuarios.spec.ts
│   ├── produtos.spec.ts
│   └── login.spec.ts
└── web/
    └── README.md
```

## Instalação

É necessário ter Node.js e npm instalados.

Execute na raiz do projeto:

```bash
npm install
```

## Executar todos os testes configurados

```bash
npx playwright test
```

## Executar apenas os testes de API

```bash
npx playwright test tests/api
```

Ou utilize o script:

```bash
npm run test:api
```

## Gerar e visualizar o relatório

O relatório HTML é gerado durante a execução dos testes.

Para abri-lo:

```bash
npm run test:report
```

## API testada

https://serverest.dev

## Evidências

As evidências da execução serão anexadas à descrição do
Pull Request.
