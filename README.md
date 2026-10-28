# unicesumar-teste-de-software
Repositório utilizado na disciplina de Projeto, Implementação e Teste de Software do curso de Engenharia de Software da Unicesumar Ponta Grossa

## Atividade 02 — 2º Bimestre: Evolução da Suíte de Testes de API

Evolução da Atividade 01 em TypeScript com Playwright Test e Faker, com **15 testes de API** para o [ServeRest](https://serverest.dev/). Cada cenário prepara os próprios dados e pode ser executado isoladamente ou em paralelo.

### Instalação

Requisitos: Node.js 20.19+, 22.13+ ou 24+ (linhas compatíveis com o Faker instalado) e npm 10 ou superior. Recomenda-se Node.js 24.

```bash
npm install
```

Os testes de API não precisam da instalação de navegadores.

### Execução

```bash
# Suíte completa
npx playwright test

# Somente os testes de API
npx playwright test tests/api
# ou
npm run test:api

# Executar um único cenário, sem depender de outros testes
npx playwright test tests/api/carrinhos.spec.ts -g "cria carrinho"

# Verificar os tipos TypeScript
npm run typecheck

# Abrir o relatório HTML da última execução
npx playwright show-report
```

O `playwright.config.ts` centraliza a URL da API, o limite de 30 segundos por teste, o paralelismo com dois workers e os relatórios de execução. As requisições usam caminhos relativos. Para testar outra instância:

```bash
SERVEREST_BASE_URL=http://localhost:3000 npm run test:api
```

### Organização e reutilização

- `tests/api/`: cenários e verificações separados em usuários, login, produtos e carrinhos.
- `tests/data/factories.ts`: gera usuários e produtos com Faker; UUIDs evitam colisões de e-mails e nomes de produtos.
- `tests/helpers/auth.ts`: realiza login, verifica a resposta e fornece o cabeçalho de autenticação.
- `tests/helpers/api.ts`: concentra cadastros reutilizados e registra a limpeza dos recursos antes das verificações.
- `tests/fixtures/api.fixture.ts`: fornece sessões de administrador e cliente sob demanda e executa a limpeza por teste, inclusive após falhas.

Os recursos são removidos na ordem inversa da criação: carrinhos são cancelados antes da exclusão dos produtos e usuários. Falhas na limpeza são reportadas e não impedem as demais tentativas. Os cenários que excluem recursos explicitamente aceitam a ausência deles durante a limpeza posterior. Os cenários de autorização usam uma sessão administrativa separada na limpeza, caso uma regressão aceite indevidamente o cadastro. Nenhum teste exige usuários, produtos ou carrinhos previamente cadastrados.

### Cenários cobertos

- Usuários: cadastro dinâmico com consulta dos dados persistidos, e-mail inválido e bloqueio de e-mail duplicado.
- Login: credenciais válidas, senha incorreta de usuário existente e usuário não cadastrado.
- Produtos: listagem de recurso próprio, ausência de token, autorização de administrador, cadastro e consulta, preço inválido, edição e exclusão com verificação do estado final.
- Carrinhos: criação com validação de totais, redução de estoque e cancelamento com reposição; bloqueio de compra acima do estoque disponível.

As verificações incluem status HTTP, mensagens, identificadores, dados persistidos, regras de negócio e ausência de efeitos colaterais em cadastros rejeitados. A [evidência da execução](docs/evidencias/atividade02.txt) registra os comandos e resultados. O relatório HTML é gerado em `playwright-report/` e não é versionado.

O projeto `web` da atividade anterior continua disponível em `tests/web`. Quando houver testes Web, instale o Chromium com `npx playwright install chromium`, defina `WEB_BASE_URL` e execute `npm run test:web`.

# Materiais

- ## [Mind Map](https://app.xmind.com/share/0ThrBL00) da Disciplina

# Materiais Complementares
- ## Curso de Git e GitHub do Goku
    - [Instruções para configuração de ambiente e atividades das aulas](https://booming-blouse-e16.notion.site/390cf9ad8d508083ad3de85713c19a4a?v=390cf9ad8d5080349a8b000ccb843083&pvs=143)
    - [Aulas gravadas](https://drive.google.com/drive/folders/1jcjCtkjueHFcE28LDyLnI9Dx-F3WBIlF?usp=sharing)
    - [Formulário para ter acesso ao repositório do curso](https://docs.google.com/forms/d/e/1FAIpQLSetBGH_UzZEZFoJuQERJhLkpFImu__nDS-dW8UZHjtJruDnbw/viewform?usp=sharing&ouid=115907476640584517407)

- ## Curso de Testes de API do Goku
    - [Aulas gravadas](https://drive.google.com/drive/folders/18D9ZJ1F-pVPy0S_DndA2mLCTLe7aBtkX?usp=sharing)
    - [Mind Map utilizado no treinamento](https://app.xmind.com/share/FGhdypvt) - senha: dojodoqame

## Manifesto Oficial

### Lista de alunos que concordam que o Professor Goku é o melhor professor do universo
Adicione seu nome, turma (ESOFT6S) e ano (2026) em ordem alfabética:

1. Aluno Exemplo (ESOFT6S - 2026)
2. 


## Atividade 01 — 2º Bimestre: Automação de Testes de API com Playwright

### Objetivo

Automatizar testes de API utilizando Playwright e TypeScript, verificando códigos de status HTTP, estrutura das respostas, dados retornados e regras de negócio da API ServeRest.

### Tecnologias utilizadas

- Node.js
- TypeScript
- Playwright Test
- API ServeRest: https://serverest.dev/

### Estrutura dos arquivos

```text
unicesumar-teste-de-software/
├── tests/
│   ├── api/
│   │   └── serverest.spec.ts
│   └── web/
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
└── .gitignore
```

### Instalação

Após clonar o repositório e acessar a pasta do projeto, execute:

```bash
npm install
```

### Execução dos testes

Executar todos os testes:

```bash
npx playwright test
```

Executar somente os testes da API:

```bash
npm run test:api
```

Verificar os tipos do TypeScript:

```bash
npm run typecheck
```

Abrir o relatório HTML:

```bash
npm run test:report
```

### Cenários automatizados da API

1. Listagem de usuários e validação dos dados.
2. Listagem de produtos e validação dos dados.
3. Pesquisa de usuários inexistentes, validando o retorno de lista vazia.
4. Tentativa de login com credenciais inválidas.
5. Tentativa de cadastro de usuário sem os campos obrigatórios.
6. Tentativa de cadastro de produto sem autorização.

### Resultado da execução

Na última execução registrada, os seis testes de API passaram. A verificação do TypeScript também foi concluída sem erros.

### Evidências

As capturas de tela das execuções e do relatório HTML podem ser anexadas ao Pull Request para demonstrar os resultados da atividade.