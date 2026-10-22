
# Automação de Testes de API com Playwright

Projeto acadêmico de automação de testes da API [ServeRest](https://serverest.dev), desenvolvido com Playwright Test e TypeScript.

## Tecnologias utilizadas

- Node.js e npm
- TypeScript
- Playwright Test
- Faker.js para geração de dados dinâmicos
- ServeRest API

## Estrutura do projeto

```text
tests/
├── api/
│   ├── login.spec.ts
│   ├── produtos.spec.ts
│   └── usuarios.spec.ts
├── data/
│   └── factories.ts
├── fixtures/
├── helpers/
│   └── api.ts
└── web/
playwright.config.ts
tsconfig.json
package.json
```

- `tests/api`: testes organizados por funcionalidade.
- `tests/data`: fábricas de dados dinâmicos para usuários e produtos.
- `tests/helpers`: funções reutilizáveis para cadastro e autenticação.
- `tests/fixtures`: reservado para fixtures compartilhadas.
- `tests/web`: reservado para futuros testes de interface.

## Pré-requisitos

- Node.js e npm instalados.
- Acesso à internet para utilizar a API pública ServeRest.

## Instalação

Clone o repositório, acesse a pasta do projeto e instale as dependências:

```bash
npm install
```

## Execução dos testes

Executar todos os testes:

```bash
npm test
```

Executar somente os testes de API:

```bash
npm run test:api
```

Alternativamente:

```bash
npx playwright test --project=api
```

Verificar os testes encontrados sem executá-los:

```bash
npx playwright test --project=api --list
```

Verificar os tipos TypeScript:

```bash
npx tsc --noEmit
```

## Cenários automatizados

A suíte contempla nove testes de API, organizados por responsabilidade:

### Usuários
- Listagem de usuários e validação da resposta.
- Cadastro e consulta dos dados persistidos.
- Rejeição de cadastro com e-mail duplicado.
- Rejeição de cadastro com campos inválidos.

### Login
- Autenticação com credenciais válidas e validação do token.
- Rejeição de login com credenciais inválidas.

### Produtos
- Listagem de produtos e validação da resposta.
- Cadastro autenticado e consulta dos dados persistidos.
- Rejeição da criação de produto sem autenticação.

Os testes verificam status HTTP, mensagens, propriedades das respostas e, quando aplicável, os dados persistidos após as operações.

## Melhorias realizadas

- Centralização da configuração do Playwright.
- Separação dos testes por funcionalidade.
- Criação de funções auxiliares reutilizáveis para cadastro e login.
- Geração de dados dinâmicos com Faker.js.
- Validação dos dados retornados e persistidos pela API.
- Verificação de regras de negócio e cenários negativos.
- Organização da estrutura para futura expansão dos testes Web.

## Configuração da URL da API

Por padrão, os testes utilizam `https://serverest.dev`.

Para utilizar outra URL, defina a variável de ambiente `SERVEREST_URL`.

No PowerShell:

```powershell
$env:SERVEREST_URL = "https://serverest.dev"
npm run test:api
```
