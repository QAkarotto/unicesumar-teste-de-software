# unicesumar-teste-de-software

Repositório utilizado na disciplina de Projeto, Implementação e Teste de Software do curso de Engenharia de Software da Unicesumar — Ponta Grossa.

## Materiais

- [Mind Map da disciplina](https://app.xmind.com/share/0ThrBL00)

## Materiais complementares

### Curso de Git e GitHub do Goku

- [Instruções para configuração do ambiente e atividades das aulas](https://booming-blouse-e16.notion.site/390cf9ad8d508083ad3de85713c19a4a?v=390cf9ad8d5080349a8b000ccb843083&pvs=143)
- [Aulas gravadas](https://drive.google.com/drive/folders/1jcjCtkjueHFcE28LDyLnI9Dx-F3WBIlF?usp=sharing)
- [Formulário para ter acesso ao repositório do curso](https://docs.google.com/forms/d/e/1FAIpQLSetBGH_UzZEZFoJuQERJhLkpFImu__nDS-dW8UZHjtJruDnbw/viewform?usp=sharing&ouid=115907476640584517407)

### Curso de Testes de API do Goku

- [Aulas gravadas](https://drive.google.com/drive/folders/18D9ZJ1F-pVPy0S_DndA2mLCTLe7aBtkX?usp=sharing)
- [Mind Map utilizado no treinamento](https://app.xmind.com/share/FGhdypvt) — senha: `dojodoqame`

## Manifesto oficial

### Lista de alunos que concordam que o Professor Goku é o melhor professor do universo

Adicione seu nome, turma (ESOFT6S) e ano (2026) em ordem alfabética.

1. Aluno Exemplo (ESOFT6S - 2026)
2.

---

## Atividade 01 — Automação de Testes de API com Playwright

Projeto inicial de testes automatizados da API ServeRest utilizando Playwright e TypeScript.

### Requisitos

- Node.js e npm instalados.

### Instalação

```bash
npm install
```

### Execução dos testes

Todos os testes:

```bash
npm test
```

Somente testes de API:

```bash
npm run test:api
```

Somente testes Web:

```bash
npm run test:web
```

### Estrutura

- `playwright.config.ts`: configuração do Playwright.
- `tsconfig.json`: configuração do TypeScript.
- `tests/api/`: testes automatizados da API ServeRest.
- `tests/web/`: diretório preparado para testes Web.

---

## Atividade 02 — Evolução da Suíte de Testes de API com Playwright

### Objetivo

Evoluir a suíte de testes da API ServeRest, utilizando Playwright e TypeScript, com dados dinâmicos, reutilização de código, fixtures e limpeza dos dados criados durante os testes.

### Tecnologias

- Node.js e npm.
- TypeScript.
- Playwright Test.
- Faker (`@faker-js/faker`).
- API ServeRest: https://serverest.dev/

### Instalação

Clone o repositório, acesse a pasta do projeto e instale as dependências:

```bash
npm install
```

### Execução dos testes

Executar todos os testes:

```bash
npm test
```

Executar apenas os testes de API:

```bash
npm run test:api
```

Executar apenas os testes Web:

```bash
npm run test:web
```

Executar os testes de API sequencialmente:

```bash
npx playwright test --project=api --workers=1
```

Listar os testes de API sem executá-los:

```bash
npx playwright test --project=api --list
```

### Organização do projeto

- `playwright.config.ts`: configurações e projetos do Playwright.
- `tsconfig.json`: configurações do TypeScript.
- `tests/api/usuarios.spec.ts`: testes de usuários.
- `tests/api/login.spec.ts`: testes de autenticação.
- `tests/api/produtos.spec.ts`: testes de produtos.
- `tests/api/carrinhos.spec.ts`: testes de carrinhos.
- `tests/data/factories.ts`: geração de dados dinâmicos com Faker.
- `tests/helpers/auth.ts`: criação e autenticação de usuário de teste.
- `tests/helpers/api.ts`: operações auxiliares com produtos.
- `tests/fixtures/api.fixture.ts`: disponibilização de usuário administrador e limpeza após o teste.
- `tests/web/`: diretório reservado para testes Web.

### Boas práticas utilizadas

- Dados de teste dinâmicos para reduzir conflitos entre execuções.
- Reutilização de funções auxiliares.
- Fixture para centralizar a preparação e a limpeza de usuários administradores.
- Verificação de códigos HTTP e do conteúdo das respostas.
- Blocos `finally` para limpar dados criados durante os testes, inclusive em caso de falha nas verificações.
- Separação dos testes por recurso da API.

### Observação

A suíte de API utiliza o ambiente público de testes da ServeRest. A execução depende da disponibilidade desse serviço. Os testes podem criar e excluir usuários, produtos e carrinhos de teste.
