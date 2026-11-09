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



---

## Atividade 04 — Automação de Testes E2E com Playwright

### Objetivo

Implementar testes automatizados End-to-End (E2E) na interface Web do ServeRest, utilizando Playwright e TypeScript, validando fluxos reais de cadastro, autenticação e gerenciamento de produtos.

### Tecnologias utilizadas

- Node.js e npm.
- TypeScript.
- Playwright Test.
- Faker (`@faker-js/faker`).
- Frontend ServeRest: https://front.serverest.dev/
- API ServeRest: https://serverest.dev/

### Cenários automatizados

Foram implementados três cenários de testes E2E:

**1. Cadastro e autenticação de usuário**
- Acessar a tela de cadastro pela interface Web.
- Preencher os dados utilizando informações dinâmicas.
- Validar a criação do usuário.
- Realizar login com as credenciais cadastradas.
- Verificar o acesso à área autenticada.

**2. Cadastro e consulta de produto como administrador**
- Preparar um usuário administrador por meio da API.
- Utilizar uma fixture personalizada com `test.extend()` para disponibilizar uma página autenticada.
- Acessar a tela de cadastro de produtos.
- Cadastrar um produto pela interface Web.
- Acessar a listagem e validar a presença do produto cadastrado.
- Realizar a limpeza do usuário administrador criado para o teste.

**3. Tentativa de login com credenciais inválidas**
- Acessar a tela de login.
- Informar credenciais inválidas.
- Validar a apresentação da mensagem de erro.
- Verificar que o acesso à área autenticada foi negado.

### Organização dos novos arquivos

- `tests/web/cadastro-usuario.spec.ts`: teste de cadastro e autenticação de usuário.
- `tests/web/cadastro-produto.spec.ts`: teste de cadastro e consulta de produto.
- `tests/web/login-invalido.spec.ts`: teste de autenticação com credenciais inválidas.
- `tests/fixtures/admin.fixture.ts`: fixture para preparação e autenticação de administrador.
- `tests/helpers/web.ts`: função auxiliar para preenchimento de campos da interface.

### Boas práticas aplicadas

- Utilização de dados dinâmicos com Faker.
- Separação entre preparação e execução dos cenários.
- Reutilização de código por meio de funções auxiliares.
- Utilização de fixture personalizada para autenticação administrativa.
- Validação de respostas da API quando necessário para confirmar pré-condições.
- Execução das ações principais diretamente pela interface Web.
- Verificações com `expect` e seletores semânticos do Playwright.
- Independência entre os cenários de teste.
- Limpeza dos dados de preparação após a execução da fixture.

### Execução dos testes

Executar somente os testes E2E:

```bash
npm run test:web
```

Executar somente os testes de API:

```bash
npm run test:api
```

Executar toda a suíte de testes:

```bash
npm test
```

Caso seja necessário instalar o navegador Chromium:

```bash
npx playwright install chromium
```

### Resultado da execução

Na execução final da suíte completa, foram obtidos os seguintes resultados:

| Tipo de teste | Aprovados |
|---|---:|
| Testes de API | 12 |
| Testes E2E Web | 3 |
| **Total** | **15** |

Todos os 15 testes foram executados com sucesso, sem falhas.

---

---

## Atividade 05 - Testes de Desempenho com k6

Nesta atividade foram realizados testes de desempenho na API ServeRest utilizando a ferramenta k6, com execução exclusivamente em ambiente local por meio do Docker.

### Cenários implementados

- **Carga inicial:** 1 usuário virtual durante 30 segundos.
- **Carga progressiva:** aumento gradual de 1 para 5 e 10 usuários virtuais, seguido da redução até zero.

### Endpoints avaliados

- GET /produtos
- GET /usuarios

### Resultados

| Métrica | Carga inicial | Carga progressiva |
|---|---:|---:|
| Requisições HTTP | 60 | 510 |
| Checks aprovados | 100% | 100% |
| Tempo médio | 12,88 ms | 6,62 ms |
| p95 | 26,12 ms | 15,56 ms |
| Taxa de falhas | 0% | 0% |

### Arquivos da atividade

Os scripts, resultados e relatório estão disponíveis na pasta `performance/`:

- `carga-inicial.js`
- `carga-progressiva.js`
- `resultados-carga-inicial.json`
- `resultados-carga-progressiva.json`
- `relatorio-desempenho.md`

### Execução dos testes

Com o ServeRest local iniciado na porta 3000, execute:

```bash
k6 run performance/carga-inicial.js
k6 run performance/carga-progressiva.js
```

Todos os testes foram executados contra `http://localhost:3000`, sem utilizar a API pública para testes de carga.

