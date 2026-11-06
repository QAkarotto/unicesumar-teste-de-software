# Atividade 04 - 2BIM: Testes E2E com Playwright (ServeRest Front)

Testes automatizados End-to-End com **Playwright** (`@playwright/test`, JavaScript) para o
[ServeRest Front](https://front.serverest.dev/).

## Cenários implementados

| # | Arquivo | O que valida |
|---|---------|--------------|
| 1 | `tests/cadastro-autenticacao.spec.js` | Cadastra usuário comum pela UI, faz login e valida a área do perfil (`/home`, sem acesso ao painel admin) |
| 2 | `tests/produto-admin.spec.js` | Com a fixture de admin, cadastra produto pela UI, abre a listagem e confere nome, preço, descrição e quantidade |
| 3 | `tests/login-invalido.spec.js` | Login inválido: mensagem de erro, permanece em `/login` e `/admin/home` continua bloqueado |

## Estrutura

```
├── fixtures/admin.fixture.js   # test.extend(): fixtures `admin` e `paginaAdmin`
├── helpers/dados.js            # geração de dados únicos (e-mail e nome de produto)
├── helpers/api.js              # API só para preparar/limpar dados
├── tests/*.spec.js             # os 3 cenários
├── playwright.config.js
└── package.json
```

## Decisões de projeto

- **Fixture personalizada** (`test.extend`): cria um administrador único via API, faz login
  pela interface e entrega `paginaAdmin` já autenticada ao teste de produto. O admin é removido ao final.
- **Seletores estáveis**: `page.getByTestId()` em tudo que possui `data-testid`. A tabela de
  produtos e o alerta de erro não têm `data-testid` no front, então usei `getByRole('row')` e a classe `.alert-secondary`.
- **Dados únicos**: e-mail e nome de produto usam timestamp + sufixo aleatório.
- **Independência**: cada teste cria e remove seus próprios dados; nada depende de outro teste.
- **Sem esperas fixas**: nenhum `waitForTimeout()`; apenas auto-wait e `expect` com retry.
- **API apenas como apoio**: criar/remover usuário e produto. As ações principais ocorrem na interface.

## Como executar

Pré-requisito: **Node.js 18 ou superior** (`node -v`).

```bash
# 1. instalar dependências
npm install

# 2. baixar o navegador usado pelo Playwright
npx playwright install chromium

# 3. rodar os testes
npx playwright test

# 4. abrir o relatório HTML
npx playwright show-report
```

Outras opções: `npx playwright test --headed` (vê o navegador), `npx playwright test --ui` (modo interativo),
`npx playwright test tests/login-invalido.spec.js` (um arquivo só).

No Linux, se faltar alguma biblioteca do sistema: `npx playwright install --with-deps chromium`.

## Evidência da execução

Após rodar, os resultados ficam em:

- `playwright-report/index.html` — relatório HTML (abra com `npx playwright show-report`)
- `evidencias/resultado.json` — resultado em JSON

Cole aqui o resultado do terminal e/ou um print do relatório:

```
(cole a saída de `npx playwright test` aqui)
```
