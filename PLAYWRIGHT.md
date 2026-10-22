# Testes Automatizados com Playwright

Testes automatizados de API para o [ServeRest](https://serverest.dev/) usando [Playwright](https://playwright.dev/) com TypeScript. A mesma estrutura já está preparada para futuros testes Web.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm

## Estrutura

```
.
├── package.json
├── playwright.config.ts      # baseURL, timeouts e projetos "api" e "web"
├── tsconfig.json
└── tests/
    ├── api/                  # Somente cenários e verificações
    │   ├── carrinhos.spec.ts
    │   ├── login.spec.ts
    │   ├── produtos.spec.ts
    │   └── usuarios.spec.ts
    ├── data/
    │   ├── factories.ts      # Geração dinâmica de dados com Faker + tipos
    │   └── mensagens.ts      # Mensagens esperadas da API
    ├── fixtures/
    │   └── api.fixture.ts    # Pré-condições (usuário, admin, produto, carrinho) e limpeza
    ├── helpers/
    │   ├── api.ts            # Cliente com os endpoints (caminhos relativos)
    │   └── auth.ts           # Login e obtenção do token
    └── web/                  # Estrutura reservada para futuros testes Web
```

| Arquivo | Responsabilidade |
| --- | --- |
| `playwright.config.ts` | Único lugar com a URL da API (`baseURL`), timeouts e opções comuns. A URL pode ser trocada com a variável `API_URL`. |
| `tests/helpers/api.ts` | Encapsula as requisições de cada recurso (`usuarios`, `login`, `produtos`, `carrinhos`). |
| `tests/helpers/auth.ts` | Fluxo de autenticação reutilizável: login → token. |
| `tests/data/factories.ts` | Gera usuários e produtos únicos com Faker, permitindo sobrescrever campos. |
| `tests/fixtures/api.fixture.ts` | Fixtures `api`, `admin`, `criarUsuario`, `criarUsuarioAutenticado`, `criarProduto`, `criarCarrinho` e `registrarLimpeza`. Tudo que é criado é removido ao final do teste. |

## Instalação

```bash
npm install
```

> Os testes de API não precisam de navegador. Para os futuros testes Web, instale os navegadores com `npx playwright install`.

## Execução

| Comando | Descrição |
| --- | --- |
| `npx playwright test` | Executa todos os testes |
| `npx playwright test tests/api` | Executa apenas a suíte de API |
| `npx playwright test tests/api/carrinhos.spec.ts` | Executa um único arquivo |
| `npx playwright show-report` | Abre o relatório HTML da última execução |

Os mesmos comandos estão disponíveis como scripts: `npm test`, `npm run test:api`, `npm run test:web` e `npm run report`.

Para executar contra outro ambiente do ServeRest (ex.: local):

```bash
API_URL=http://localhost:3000 npx playwright test tests/api
```

## Independência e ciclo de vida dos dados

- Nenhum teste depende de outro: cada um prepara as próprias pré-condições por meio das fixtures (ex.: `criar usuário → autenticar → criar produto → consultar produto`).
- Os dados são gerados dinamicamente a cada execução (`tests/data/factories.ts`), evitando conflito com registros já existentes no ServeRest.
- Os recursos criados são removidos automaticamente no teardown da fixture `registrarLimpeza`, na ordem inversa da criação (carrinho → produto → usuário), já que o ServeRest não permite excluir produtos ou usuários vinculados a um carrinho.

## Cenários de API

| Arquivo | Cenário | Status esperado |
| --- | --- | --- |
| `login.spec.ts` | Autenticação com credenciais válidas retorna token `Bearer` | 200 |
| `login.spec.ts` | Autenticação com senha inválida | 401 |
| `login.spec.ts` | Autenticação com e-mail não cadastrado | 401 |
| `login.spec.ts` | Autenticação com campos em branco | 400 |
| `usuarios.spec.ts` | Lista usuários e valida que `quantidade` é igual ao total retornado | 200 |
| `usuarios.spec.ts` | Cadastro com dados dinâmicos e consulta dos dados persistidos | 201 / 200 |
| `usuarios.spec.ts` | Impede cadastro com e-mail já utilizado (regra de negócio) | 400 |
| `usuarios.spec.ts` | Cadastro com e-mail e perfil inválidos | 400 |
| `usuarios.spec.ts` | Cadastro sem campos obrigatórios | 400 |
| `usuarios.spec.ts` | Atualização de usuário e validação do estado final | 200 |
| `usuarios.spec.ts` | Exclusão de usuário e validação de que não existe mais | 200 / 400 |
| `produtos.spec.ts` | Cadastro de produto sem token de autenticação | 401 |
| `produtos.spec.ts` | Usuário não administrador não pode cadastrar produto (regra de negócio) | 403 |
| `produtos.spec.ts` | Administrador autenticado cadastra produto e consulta os dados persistidos | 201 / 200 |
| `produtos.spec.ts` | Impede cadastro de produto com nome repetido (regra de negócio) | 400 |
| `produtos.spec.ts` | Cadastro com preço e quantidade negativos | 400 |
| `produtos.spec.ts` | Exclusão de produto e validação de que não existe mais | 200 / 400 |
| `carrinhos.spec.ts` | Carrinho calcula `precoTotal`/`quantidadeTotal` e baixa o estoque | 201 / 200 |
| `carrinhos.spec.ts` | Cancelar compra remove o carrinho e reabastece o estoque | 200 / 400 |
| `carrinhos.spec.ts` | Usuário não pode ter mais de um carrinho (regra de negócio) | 400 |
| `carrinhos.spec.ts` | Quantidade maior que o estoque é rejeitada e o estoque não muda | 400 |
| `carrinhos.spec.ts` | Produto que faz parte de um carrinho não pode ser excluído | 400 |
