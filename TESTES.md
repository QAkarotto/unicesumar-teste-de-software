# Testes automatizados com Playwright

Suíte de testes de API do [ServeRest](https://serverest.dev/) com Playwright + TypeScript
(Atividades 01 e 02 do 2º bimestre).

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
| `npx playwright test` | executa a suíte completa |
| `npx playwright test tests/api` ou `npm run test:api` | executa **apenas** os testes de API |
| `npx playwright test tests/api --grep CT14` | executa um único cenário (todos são independentes) |
| `npx playwright show-report` | abre o relatório HTML da última execução |

A URL da API fica apenas no `playwright.config.ts` (padrão: `https://serverest.dev`). Para usar outra
instância — por exemplo o ServeRest local, iniciado com `npx serverest` — defina `SERVEREST_API_URL`:

```bash
# Linux / macOS / WSL / Git Bash
SERVEREST_API_URL=http://localhost:3000 npx playwright test tests/api

# PowerShell
$env:SERVEREST_API_URL="http://localhost:3000"; npx playwright test tests/api
```

## Estrutura

```
playwright.config.ts          # baseURL, timeouts, workers, reporters, projetos api/web
tests/
├── api/                      # apenas cenários e verificações
│   ├── login.spec.ts
│   ├── usuarios.spec.ts
│   ├── produtos.spec.ts
│   └── carrinhos.spec.ts
├── fixtures/
│   └── api.fixture.ts        # fixtures: api (com limpeza automática), admin, usuarioComum
├── helpers/
│   ├── api.ts                # cliente ServeRestApi + pré-condições (prepararProduto, consultarEstoque)
│   ├── auth.ts               # cadastrar usuário → login → token
│   └── limpeza.ts            # registro e remoção dos recursos criados (teardown)
├── data/
│   └── factories.ts          # geração de dados com Faker (pt_BR)
└── web/                      # estrutura preparada para os testes de interface
```

### Como os testes se mantêm independentes

- Cada teste gera os próprios dados com Faker (`tests/data/factories.ts`), sem depender de cadastros prévios.
- As fixtures `admin` e `usuarioComum` criam um usuário novo e autenticado **para cada teste** que as pede.
- Tudo o que um teste cria pela fixture `api` é removido ao final dele, na ordem
  carrinhos → produtos → usuários (a mesma exigida pelas regras do ServeRest).
- Qualquer cenário pode ser executado sozinho e em qualquer ordem.

## Casos de teste

| ID | Cenário | Cobertura |
| --- | --- | --- |
| CT01 | Login com credenciais válidas | autenticação válida |
| CT02 | Login com senha incorreta | autenticação inválida |
| CT03 | Login com e-mail não cadastrado | autenticação inválida |
| CT04 | Token do login libera rota protegida; token adulterado é recusado | operação que exige autenticação |
| CT05 | Cadastro de usuário com dados do Faker e consulta pelo `_id` | cadastro dinâmico + estado final |
| CT06 | E-mail duplicado é recusado e só o cadastro original existe | regra de negócio |
| CT07 | Cadastro com todos os campos inválidos | cadastro inválido |
| CT08 | Edição de usuário; login antigo falha e o novo funciona | múltiplas requisições + estado final |
| CT09 | Exclusão de usuário; consulta posterior não o encontra | estado final |
| CT10 | Admin cadastra produto e os dados são persistidos | cadastro dinâmico + estado final |
| CT11 | Cadastro de produto sem token; nada é criado | autenticação obrigatória |
| CT12 | Usuário comum não cadastra produto | regra de negócio |
| CT13 | Nome de produto duplicado | regra de negócio |
| CT14 | Carrinho reserva estoque e calcula totais; cancelar devolve o estoque | múltiplas requisições + regra |
| CT15 | Concluir compra remove o carrinho e mantém o estoque baixado | estado final |
| CT16 | Quantidade acima do estoque é recusada; estoque inalterado | regra de negócio |
| CT17 | Usuário não pode ter dois carrinhos | regra de negócio |
| CT18 | Produto que está em carrinho não pode ser excluído | regra de negócio |
