# Automação de Testes de API com Playwright

## Sobre a atividade

Este projeto foi desenvolvido para a Atividade 01 do 2º bimestre da disciplina de Testes de Software da UniCesumar.

O objetivo é configurar o Playwright com TypeScript e desenvolver testes automatizados para validar a API ServeRest, mantendo a estrutura preparada para futuros testes Web.

## Tecnologias utilizadas

- Node.js
- npm
- TypeScript
- Playwright Test
- API ServeRest

## Estrutura do projeto

```text
unicesumar-teste-de-software/
├── tests/
│   ├── api/
│   │   └── serverest.spec.ts
│   └── web/
├── playwright.config.ts
├── package.json
├── package-lock.json
└── README.md
```

## Cenários automatizados

Foram implementados seis testes de API:

1. Listagem de usuários.
2. Listagem de produtos.
3. Listagem de carrinhos.
4. Validação dos campos dos produtos.
5. Validação dos campos dos usuários.
6. Validação da rejeição de credenciais inválidas no login.

Os testes verificam o status HTTP, informações do corpo da resposta e condições de negócio.

## Instalação

É necessário ter o Node.js e o npm instalados.

Clone o repositório e acesse a pasta do projeto. Em seguida, execute:

```bash
npm install
```

## Execução dos testes

Para executar todos os testes:

```bash
npm test
```

Para executar somente os testes de API:

```bash
npm run test:api
```

Para executar os futuros testes Web:

```bash
npm run test:web
```

## API utilizada

ServeRest: https://serverest.dev/