# Atividade 03 – 2BIM: Testes Unitários com Test Doubles no ServeRest

Testes unitários sobre o código-fonte do [ServeRest](https://github.com/ServeRest/ServeRest), isolando as
dependências com **stubs, spies e mocks** do [Sinon](https://sinonjs.org/).

## Como executar

Pré-requisito: Node.js 20 ou superior.

```bash
cd Entregas-2bim/atividade_3
npm install
npm run test:unit
```

## Estrutura

A organização segue a de testes unitários do próprio ServeRest (`test/unit/*.test.js`, Mocha + Chai + Sinon,
mesmo `.mocharc.js` e mesmo nome de script `test:unit`).

```
Entregas-2bim/atividade_3/
├── package.json                       # script test:unit; serverest fixado na versão 3.2.2
└── test/unit/
    ├── .mocharc.js
    ├── support/
    │   ├── serverest.js               # carrega os módulos de src/ do ServeRest
    │   └── express.js                 # dublês de req/res do Express
    ├── authentication-middleware.test.js
    ├── login-controller.test.js
    ├── produtos-controller.test.js
    └── carrinhos-controller.test.js
```

O código testado é o do pacote npm `serverest@3.2.2`, que publica a pasta `src/` do repositório oficial.
A versão é fixa para que os testes sempre rodem contra o mesmo código.

## Por que controllers e middlewares

Controllers e middlewares concentram as **decisões** do ServeRest (qual status responder, quando bloquear,
quando chamar a exclusão). As dependências deles (serviços com banco NeDB, geração/validação de JWT e o
`res` do Express) são justamente o que um teste unitário deve isolar. Com os dublês:

- nenhum teste acessa banco de dados, rede ou servidor HTTP;
- os testes rodam em milissegundos e não dependem uns dos outros (o `sandbox.restore()` desfaz os dublês após cada teste);
- cada teste deixa claro qual unidade é exercitada e qual dependência foi substituída.

## Casos de teste

| ID | Unidade | Cenário | Dependência substituída | Test Double |
| --- | --- | --- | --- | --- |
| CT01 | `checkAdm` | token válido + admin → chama `next()` | `verifyToken`, `existeUsuario`, `usuarioEhAdministrador`, `next` | stub + spy |
| CT02 | `checkAdm` | token válido + não admin → 403 | `usuarioEhAdministrador` | stub (com verificação de argumento) |
| CT03 | `checkToken` | esquema diferente de "Bearer" → 401 sem decodificar | `verifyToken`, `existeUsuario` | spy |
| CT04 | `checkToken` | usuário do token não existe mais → 401 | `existeUsuario` | stub |
| CT05 | `login-controller.post` | credenciais válidas → 200 + `Bearer <token>` | `existeUsuario`, `createToken` | stub |
| CT06 | `login-controller.post` | credenciais inválidas → 401 e token não é gerado | `existeUsuario`, `createToken` | stub + spy |
| CT07 | `produtos-controller.delete` | produto livre → `deleteById(id)` uma vez | `deleteById` | **mock** |
| CT08 | `produtos-controller.delete` | produto em carrinho → `deleteById` nunca | `deleteById` | **mock** |
| CT09 | `produtos-controller.delete` | id inexistente → "Nenhum registro excluído" | `deleteById` | stub |
| CT10 | `produtos-controller.post` | nome com espaços → busca duplicidade com o nome aparado | `existeProduto`, `criarProduto` | stub (com verificação de argumentos e ordem) |
| CT11 | `produtos-controller.post` | nome repetido → 400 e nada é criado | `existeProduto`, `criarProduto` | stub + spy |
| CT12 | `carrinhos-controller.cancelarCompra` | remove exatamente o carrinho do usuário | `getCarrinhoDoUsuario`, `removeCarrinho` | **mock** |
| CT13 | `carrinhos-controller.cancelarCompra` | sem carrinho → nada é removido | `getCarrinhoDoUsuario`, `removeCarrinho` | **mock** |

## Os testes detectam defeitos?

Para conferir que os testes validam comportamento (e não só "rodam sem erro"), foram inseridos 10 defeitos
no código do ServeRest, um de cada vez. Todos foram detectados:

| Defeito inserido | Teste que falhou |
| --- | --- |
| `delete` ignora a verificação de carrinho | CT08 |
| `post` não remove espaços do nome | CT10 |
| mensagens de exclusão invertidas | CT07, CT09 |
| login devolve o token sem "Bearer" | CT05 |
| login não verifica se o usuário existe | CT06 |
| `checkAdm` responde 401 em vez de 403 | CT02 |
| `checkToken` aceita esquema diferente de "Bearer" | CT03 |
| `checkToken` não verifica se o usuário do token existe | CT04 |
| `cancelarCompra` não remove o carrinho | CT12 |
| `cancelarCompra` tenta remover sem haver carrinho | CT13 |
