# Atividade 04 – 2BIM: Testes E2E com Playwright no ServeRest Front

Testes End-to-End que usam o [ServeRest Front](https://front.serverest.dev/) pelo navegador, com
[Playwright](https://playwright.dev/) e TypeScript, cobrindo as três jornadas pedidas: cadastro e autenticação de usuário,
cadastro de produto pelo administrador e login com credenciais inválidas.

## Como executar

Pré-requisito: Node.js 20 ou superior.

```bash
cd Entregas-2bim/atividade_4
npm install
npx playwright install chromium

npm run test:e2e        # roda os 5 testes (headless)
npm run evidencias      # roda os testes e salva a evidência em evidencias/
npm run test:report     # abre o relatório HTML da última execução
```

Outros comandos:

```bash
npm run test:e2e:headed   # roda com o navegador visível, um teste por vez
npm run typecheck         # checagem de tipos do TypeScript
```

Por padrão os testes rodam contra `https://front.serverest.dev` (que usa a API `https://serverest.dev`). Para usar
outra instância, defina `SERVEREST_WEB_URL` e `SERVEREST_API_URL`. As duas URLs ficam só em `tests/support/ambiente.ts`.

## Estrutura

```
Entregas-2bim/atividade_4/
├── playwright.config.ts                         # baseURL do front, Chromium, reporters list + html + json
├── scripts/gerar-evidencias.js                  # npm run evidencias
├── evidencias/                                  # resumo.md, execucao.txt e screenshots/ (gerados)
└── tests/
    ├── e2e/
    │   ├── cenario1-cadastro-e-autenticacao.spec.ts
    │   ├── cenario2-cadastro-de-produto.spec.ts
    │   └── cenario3-login-invalido.spec.ts
    ├── fixtures/
    │   └── e2e.fixture.ts                       # test.extend(): api, limpeza, admin, adminPage
    ├── pages/                                   # page objects (seletores e ações de cada tela)
    │   ├── login.page.ts
    │   ├── cadastro-usuario.page.ts
    │   ├── areas.page.ts                        # área do admin e área do cliente
    │   └── produtos.page.ts                     # cadastro e listagem de produtos
    └── support/
        ├── ambiente.ts                          # URLs do front e da API
        ├── factories.ts                         # dados únicos por execução
        ├── api.ts                               # cliente da API (só pré-condições e limpeza)
        ├── limpeza.ts                           # remoção da massa de dados no teardown
        └── sessao.ts                            # leitura/gravação da sessão do front (localStorage)
```

## Casos de teste

| ID | Cenário | O que o teste faz pela interface | Principais asserções |
| --- | --- | --- | --- |
| CT01 | 1 – Cadastro e autenticação | cadastra um usuário **comum**, faz login com as credenciais cadastradas | mensagem "Cadastro realizado com sucesso"; `POST /login` 200; URL `/home`; sessão com `Bearer`; loja e menu de cliente visíveis; menus de admin **ausentes** |
| CT02 | 1 – Cadastro e autenticação | cadastra um usuário **administrador**, faz login com as credenciais cadastradas | mensagem de sucesso; `POST /login` 200; URL `/admin/home`; "Bem Vindo <nome>"; menus de admin visíveis; carrinho **ausente** |
| CT03 | 2 – Cadastro de produto | com a página já autenticada pela fixture, abre o cadastro pelo menu, cadastra o produto e acessa a listagem | `POST /produtos` 201; redirecionamento para `/admin/listarprodutos`; **uma** linha com o produto; nome, preço, descrição e quantidade iguais aos informados |
| CT04 | 3 – Credenciais inválidas | tenta entrar com um e-mail que não existe | `POST /login` 401; um alerta com "Email e/ou senha inválidos"; continua em `/login`; nenhuma sessão gravada; abrir `/admin/home` pela URL devolve para `/login` |
| CT05 | 3 – Credenciais inválidas | tenta entrar com a senha errada de um usuário que existe (criado pela API) | as mesmas do CT04 |

O cenário 1 roda para os dois perfis porque o requisito é "acessar a área correspondente ao seu perfil", e o front
leva cada perfil para uma área diferente. O cenário 3 cobre as duas formas de errar a credencial, e nas duas o ServeRest
deve responder com a mesma mensagem genérica.

## Fixture personalizada

As fixtures ficam em `tests/fixtures/e2e.fixture.ts`, criadas com `test.extend()`. Todas têm escopo de teste e só são
montadas quando o teste as pede:

| Fixture | Entrega | Teardown |
| --- | --- | --- |
| `api` | cliente da API do ServeRest, com `baseURL` próprio (a do projeto é a do front) | descarta o contexto de requisições |
| `limpeza` | agenda a remoção do que o teste criar (por e-mail ou nome, porque o que é cadastrado pela tela não devolve `_id`) | remove produtos e depois usuários, **mesmo se o teste falhar** |
| `admin` | administrador novo, cadastrado e autenticado pela API | removido pela `limpeza` |
| `adminPage` | `page` já autenticada como `admin` e aberta em `/admin/home` | — |

A `adminPage` faz um **login programático**: pega o token da fixture `admin` e grava no `localStorage` as mesmas chaves
que a tela de login gravaria (`serverest/userToken`, `serverest/userEmail`, `serverest/userNome`). Antes de entregar a
página, ela confere que a sessão está ativa (URL `/admin/home`, saudação com o nome do admin e menu de cadastro de
produtos visível). Assim o CT03 começa autenticado e testa só o cadastro do produto:

```ts
test('CT03 - ...', async ({ adminPage, admin, limpeza }) => {
  // adminPage já está em /admin/home, logada como admin
});
```

## Boas práticas aplicadas

- **Seletores estáveis.** Todos os campos, botões e menus usam `page.getByTestId()`. Duas telas do front não têm
  `data-testid`, e nelas uso papéis de acessibilidade, que também são estáveis: a tabela de produtos
  (`getByRole('row')` / `getByRole('cell')`) e os alertas de erro (`getByRole('alert')`). O botão de cadastrar produto
  tem o `data-testid` `cadastarProdutos` (sem o "r"), que é o valor real no front.
- **Preparação separada da ação.** Cada teste é dividido em `test.step()`. Os passos de pré-condição começam com
  "Preparação:" e usam a API ou a fixture; os passos de comportamento acontecem só pela interface.
- **Dados únicos.** `support/factories.ts` gera nome, e-mail, senha e produto com um sufixo aleatório (`crypto.randomUUID`)
  a cada chamada.
- **Independência.** Cada teste cria a própria massa de dados e a remove no teardown, e nenhum teste usa dado de outro.
  A suíte roda com `fullyParallel` e também passou com `--repeat-each=5` em 4 workers (25 execuções, 0 falhas).
- **Sem esperas fixas.** Não há `waitForTimeout()`. As esperas são as do próprio Playwright: auto-wait das ações,
  `expect` com nova tentativa automática e `waitForResponse` para conferir o status HTTP das ações principais.
- **Asserções que comprovam o resultado.** Além do que aparece na tela, os testes conferem o status HTTP da ação, a URL,
  a sessão no navegador e a ausência dos elementos que o perfil não deveria ver.

## Os testes detectam defeitos?

Para conferir que as asserções pegam erros reais (e não só "rodam sem erro"), a suíte foi executada contra uma cópia
local do código do front oficial ([ServeRest/front](https://github.com/ServeRest/front)), com uma API local que reproduz
as respostas do ServeRest. Foram inseridos 9 defeitos, um de cada vez, e todos foram detectados:

| Defeito inserido | Teste que falhou |
| --- | --- |
| usuário comum é levado para a área do admin após o login | CT01 |
| cadastro ignora a opção "Cadastrar como administrador?" | CT02 |
| login não redireciona o usuário para a área dele | CT01, CT02 |
| listagem mostra a quantidade na coluna de preço | CT03 |
| cadastro de produto envia a quantidade no lugar do preço | CT03 |
| login com falha grava um token no navegador | CT04, CT05 |
| área do admin abre sem token | CT04, CT05 |
| tela de login não mostra a mensagem devolvida pela API | CT04, CT05 |
| API aceita senha errada | CT05 |

## Evidência da execução

`npm run evidencias` roda a suíte e gera em `evidencias/`:

- `resumo.md`: data, URLs usadas e resultado/duração de cada teste;
- `execucao.txt`: saída completa do terminal;
- `screenshots/`: estado final de cada teste (`CTxx-final.png`) e os momentos principais
  (`CT03-formulario-preenchido.png`, `CT04-mensagem-de-erro.png`, `CT05-mensagem-de-erro.png`).

O relatório HTML completo (passos, prints e, em caso de falha, vídeo e trace) fica em `playwright-report/` e abre com
`npm run test:report`.

## Observações sobre o front

- Depois do cadastro, o próprio front faz login automático e redireciona após 3 segundos. Para que a autenticação
  validada no cenário 1 seja a feita na tela de login, o teste abre `/login` e descarta essa sessão antes de autenticar.
- Para decidir a rota após o login (admin ou cliente), o front baixa a lista inteira de usuários da API pública, o que
  pode demorar. Por isso o `expect` espera até 15 s, sempre com nova tentativa automática e nunca com espera fixa.
