# Atividade 07: Automação de Testes de API com Playwright

## Objetivo

Configurar o **Playwright** no repositório da disciplina e desenvolver testes automatizados para a API do **ServeRest**, preparando a mesma estrutura para futuros testes Web.

**Repositório:** https://github.com/QAkarotto/unicesumar-teste-de-software  
**API:** https://serverest.dev/

## Atividade

Crie uma branch a partir da `master` e implemente toda a estrutura necessária para executar testes com Playwright.

A configuração deve utilizar **TypeScript** e permitir a separação entre testes de API e futuros testes Web.

Estrutura mínima sugerida:

```text
tests/
├── api/
└── web/
```

O projeto deverá conter os arquivos necessários para instalação, configuração e execução, incluindo:

- `package.json`;
- `playwright.config.ts`;
- dependências do Playwright;
- testes em `tests/api`;
- estrutura preparada em `tests/web`;
- instruções de execução no `README.md` ou arquivo equivalente.

## Testes

Implemente **pelo menos 6 testes de API** utilizando o Playwright.

Os testes devem contemplar:

- cenários de sucesso;
- pelo menos um cenário inválido;
- validação do status HTTP;
- validação de informações relevantes do corpo da resposta;
- pelo menos uma regra ou condição de negócio.

Utilize o recurso de requisições HTTP do Playwright e evite testes que validem apenas o status code.

## Execução

A solução deve permitir a instalação das dependências e a execução dos testes a partir do repositório.

Exemplo:

```bash
npm install
npx playwright test
```

Também deve ser possível executar apenas os testes de API.

## Entrega

A entrega deverá ser realizada por **Pull Request** para a branch `master` do repositório da disciplina.

O Pull Request deve conter:

- toda a estrutura necessária para executar o projeto;
- configuração do Playwright;
- testes de API implementados;
- organização preparada para futuros testes Web;
- instruções breves de instalação e execução;
- **evidência da execução dos testes**, anexada à descrição do Pull Request.

Não envie alterações diretamente para a `master`.

## Materiais de apoio

- Playwright — instalação e configuração: https://playwright.dev/docs/intro
- Playwright — testes de API: https://playwright.dev/docs/api-testing
- Playwright — configuração do Test Runner: https://playwright.dev/docs/test-configuration
- ServeRest: https://serverest.dev/
