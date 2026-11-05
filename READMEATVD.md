## Atividade 01 — Automação de Testes de API com Playwright

### Objetivo

Configurar o Playwright com TypeScript para realizar testes automatizados na API ServeRest, mantendo o projeto organizado para futuros testes Web.

### Tecnologias utilizadas

- Node.js e npm
- TypeScript
- Playwright Test
- API ServeRest

### Estrutura do projeto

```text
tests/
├── api/
│   └── serverest.spec.ts
└── web/
playwright.config.ts
package.json
package-lock.json
```

### Cenários de teste

Foram implementados seis testes automatizados:

1. Listagem de usuários.
2. Listagem de produtos.
3. Listagem de carrinhos.
4. Validação dos campos dos produtos.
5. Validação dos campos dos usuários.
6. Rejeição de credenciais inválidas no login.

Os testes verificam códigos HTTP, estrutura e conteúdo das respostas JSON e regras de negócio.

### Instalação

Com o Node.js instalado, execute:

```bash
npm install
```

### Execução

Executar todos os testes:

```bash
npm test
```

Executar somente os testes de API:

```bash
npm run test:api
```

Executar os testes Web:

```bash
npm run test:web
```

### Resultado

Na execução dos testes de API, os seis cenários foram aprovados.

### API utilizada

https://serverest.dev/