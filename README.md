---

## Automação de Testes de API com Playwright

Este projeto utiliza Playwright com TypeScript para automatizar testes de API da [ServeRest](https://serverest.dev/).

### Tecnologias utilizadas

- Node.js
- TypeScript
- Playwright Test
- ServeRest API

### Estrutura do projeto

```text
tests/
├── api/
│   └── serverest.spec.ts
└── web/
```

A pasta `tests/api` contém os testes automatizados da API. A pasta `tests/web` está reservada para futuros testes de interface web.

### Pré-requisitos

- Node.js e npm instalados.

### Instalação

Clone o repositório e acesse sua pasta. Em seguida, instale as dependências:

```bash
npm install
```

### Execução dos testes

Para executar os testes configurados no Playwright:

```bash
npm test
```

Para executar somente os testes de API:

```bash
npm run test:api
```

Também é possível utilizar diretamente o Playwright:

```bash
npx playwright test
```

Para executar somente os testes de API pelo Playwright:

```bash
npx playwright test --project=api
```

### Cenários automatizados

Os testes de API implementados contemplam:

- Listagem de usuários e validação dos dados retornados.
- Listagem de produtos e validação das informações retornadas.
- Cadastro de usuário com sucesso.
- Validação da regra de negócio que impede o cadastro de usuários com e-mail duplicado.
- Login com credenciais válidas e validação do token de autorização.
- Rejeição de login com credenciais inválidas.

Os testes validam os status HTTP e informações relevantes dos corpos das respostas.

### Configuração da URL da API

Por padrão, os testes utilizam `https://serverest.dev`. A URL pode ser personalizada pela variável de ambiente `SERVEREST_URL`, conforme a configuração do Playwright.