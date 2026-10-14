# Testes automatizados com Playwright

Atividade 01 – 2º bimestre: automação de testes de API do [ServeRest](https://serverest.dev/) com Playwright + TypeScript.

## Pré-requisitos

- Node.js 20 ou superior (`node -v`)
- npm

## Instalação

```bash
npm install
```

Os testes de API não precisam de navegador. Para os futuros testes Web, instale também o Chromium:

```bash
npx playwright install chromium
```

## Execução

| Comando | O que faz |
| --- | --- |
| `npx playwright test` | executa todos os testes (API + Web) |
| `npx playwright test --project=api` ou `npm run test:api` | executa **apenas** os testes de API |
| `npm run test:web` | executa apenas os testes Web (quando existirem) |
| `npx playwright show-report` | abre o relatório HTML da última execução |

Por padrão os testes rodam contra a API pública `https://serverest.dev`. Para usar outra instância
(por exemplo, o ServeRest local, iniciado com `npx serverest`), defina a variável `SERVEREST_API_URL`:

```bash
# Linux / macOS / WSL
SERVEREST_API_URL=http://localhost:3000 npx playwright test --project=api

# PowerShell
$env:SERVEREST_API_URL="http://localhost:3000"; npx playwright test --project=api
```

## Estrutura

```
playwright.config.ts      # projetos "api" e "web", baseURL, reporters
tests/
├── api/
│   ├── support/
│   │   ├── factories.ts  # geração de massa de dados única por execução
│   │   └── api.ts        # helpers (cadastrar usuário, login, cadastrar produto)
│   ├── usuarios.spec.ts
│   ├── login.spec.ts
│   ├── produtos.spec.ts
│   └── carrinhos.spec.ts
└── web/                  # estrutura preparada para os testes de interface
```

## Casos de teste

| ID | Cenário | Tipo | Verificações |
| --- | --- | --- | --- |
| CT01 | Cadastrar usuário e consultá-lo pelo `_id` | sucesso | 201 + mensagem + `_id`; 200 + corpo idêntico ao enviado |
| CT02 | Cadastrar usuário com e-mail já usado | regra de negócio | 400 + "Este email já está sendo usado" |
| CT03 | Filtrar usuários por e-mail | sucesso | 200 + `quantidade = 1` + dados do usuário |
| CT04 | Cadastrar usuário com campos inválidos | inválido | 400 + mensagem por campo |
| CT05 | Buscar usuário inexistente | inválido | 400 + "Usuário não encontrado" |
| CT06 | Login com credenciais válidas | sucesso | 200 + mensagem + token no formato `Bearer <JWT>` |
| CT07 | Login com senha incorreta | inválido | 401 + mensagem + ausência de token |
| CT08 | Admin cadastra produto e consulta pelo `_id` | sucesso | 201; 200 + corpo idêntico ao enviado |
| CT09 | Cadastrar produto sem token | inválido | 401 + mensagem de token ausente |
| CT10 | Usuário comum tenta cadastrar produto | regra de negócio | 403 + "Rota exclusiva para administradores" |
| CT11 | Cadastrar produto com nome repetido | regra de negócio | 400 + "Já existe produto com esse nome" |
| CT12 | Criar carrinho e cancelar a compra | regra de negócio | total/preço calculados; estoque 10 → 7 → 10 |
| CT13 | Carrinho com quantidade acima do estoque | regra de negócio | 400 + mensagem; estoque inalterado |

Cada teste cria sua própria massa de dados (e-mails e nomes únicos), então os testes são
independentes, podem rodar em paralelo e não dependem de dados pré-existentes na API pública.
