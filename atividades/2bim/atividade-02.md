# Trabalho 9: Evolução da Suíte de Testes de API com Playwright

**Valor:** 0,5 ponto  
**Repositório:** https://github.com/QAkarotto/unicesumar-teste-de-software  
**API:** https://serverest.dev/

## Objetivo

Evoluir a suíte de testes de API criada anteriormente, aplicando melhorias de organização, reutilização, independência e manutenção dos testes com Playwright.

O foco desta atividade é **exclusivamente em testes de API**. A proposta é refatorar a implementação existente para que os testes fiquem mais claros, reutilizáveis e confiáveis.

## Atividade

Partindo da implementação realizada no trabalho anterior, aplique as melhorias abaixo.

### 1. Centralize as configurações

Evite repetir informações como a URL da API em vários arquivos.

Utilize o `playwright.config.ts` para definir configurações compartilhadas, como:

- `baseURL`;
- timeout, quando necessário;
- outras opções comuns à execução.

Os testes devem utilizar caminhos relativos sempre que possível.

**Objetivo da melhoria:** reduzir duplicação e facilitar alterações futuras no ambiente de teste.

### 2. Organize a suíte por responsabilidade

Os arquivos de teste devem conter principalmente os **cenários e as verificações**.

Extraia códigos repetidos, como:

- criação de usuários;
- autenticação;
- criação de produtos;
- geração de dados;
- preparação de pré-condições;
- outras requisições reutilizadas.

Uma possível organização é:

```text
tests/
├── api/
│   ├── usuarios.spec.ts
│   ├── login.spec.ts
│   ├── produtos.spec.ts
│   └── carrinhos.spec.ts
├── helpers/
│   ├── auth.ts
│   └── api.ts
├── fixtures/
│   └── api.fixture.ts
└── data/
    └── factories.ts
```

A estrutura não precisa ser idêntica ao exemplo, mas deve deixar clara a responsabilidade de cada arquivo.

**Objetivo da melhoria:** reduzir duplicação e tornar a suíte mais simples de compreender e manter.

### 3. Reutilize a autenticação

Crie uma forma reutilizável para:

1. preparar um usuário quando necessário;
2. realizar o login;
3. obter o token;
4. utilizar o token em requisições protegidas.

Evite repetir o mesmo fluxo de autenticação em vários arquivos de teste.

**Objetivo da melhoria:** centralizar um comportamento recorrente e reduzir manutenção duplicada.

### 4. Torne os testes independentes

Um teste não deve depender da execução de outro.

Evite:

```text
teste 1 cria usuário
↓
teste 2 depende do usuário criado no teste 1
↓
teste 3 depende do resultado do teste 2
```

Quando um cenário precisar de pré-condições, prepare os dados dentro do próprio teste ou por meio de fixture/helper apropriado.

Um mesmo teste pode executar várias requisições quando elas fazem parte do mesmo comportamento analisado, por exemplo:

```text
criar usuário → autenticar → criar produto → consultar produto
```

**Objetivo da melhoria:** permitir execução isolada e evitar falhas causadas pela ordem dos testes.

### 5. Gere dados de teste dinamicamente

Evite depender de dados fixos que possam já existir no ServeRest.

Utilize uma biblioteca de geração de dados, como **Faker**, para criar valores únicos durante a execução.

Instalação sugerida:

```bash
npm install -D @faker-js/faker
```

Exemplo:

```ts
import { faker } from '@faker-js/faker';

const usuario = {
  nome: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  administrador: 'true'
};
```

Aplique geração dinâmica principalmente em dados com risco de conflito, como:

- e-mail de usuário;
- nome de produto;
- descrições;
- outros valores utilizados em cadastros.

Quando necessário, organize essa geração em uma **factory** ou helper reutilizável, em vez de espalhar chamadas ao Faker por todos os testes.

**Objetivo da melhoria:** reduzir conflitos entre execuções e tornar os testes independentes de dados previamente cadastrados.

### 6. Controle o ciclo de vida dos dados

Quando um teste criar recursos que possam interferir em outras execuções, realize a limpeza quando isso for possível e relevante.

Exemplo:

```text
gerar dados
→ criar usuário
→ executar cenário
→ validar resultado
→ remover recurso criado
```

A limpeza pode ser feita no próprio teste ou por meio dos recursos de setup e teardown do Playwright.

**Objetivo da melhoria:** manter o ambiente de testes previsível e reduzir efeitos colaterais entre execuções.

### 7. Melhore as verificações

Não valide apenas o status HTTP.

Verifique também informações relevantes do comportamento, como:

- campos retornados;
- mensagens;
- identificadores;
- valores cadastrados;
- alterações realizadas;
- regras de negócio;
- estado do recurso após uma operação.

Exemplo:

```text
criar produto
→ validar status
→ validar mensagem
→ armazenar o ID
→ consultar o produto
→ validar os dados persistidos
```

**Objetivo da melhoria:** testar o comportamento da API, e não apenas a resposta HTTP.

## Cenários obrigatórios

Após a refatoração, a suíte deverá possuir **pelo menos 8 testes de API**.

A suíte deve incluir pelo menos:

- autenticação com dados válidos;
- autenticação com dados inválidos;
- operação que exija autenticação;
- cadastro utilizando dados gerados dinamicamente;
- cadastro com dados inválidos;
- validação de uma regra de negócio;
- cenário com múltiplas requisições relacionadas;
- consulta ou validação do estado final de um recurso.

Os testes anteriores podem ser reaproveitados e refatorados.

## Execução

A solução deve permitir:

```bash
npm install
npx playwright test
```

Também deve existir um comando simples para executar apenas a suíte de API, por exemplo:

```bash
npx playwright test tests/api
```

## Entrega

A entrega deverá ser realizada por **Pull Request** para a branch `master` do repositório da disciplina.

O Pull Request deve conter:

- refatoração da estrutura anterior;
- testes existentes ajustados quando necessário;
- novos testes de API;
- helpers, fixtures, factories ou recursos reutilizáveis criados;
- uso de geração dinâmica de dados com Faker ou biblioteca equivalente;
- instruções atualizadas de instalação e execução;
- **evidência da execução completa da suíte** anexada à descrição do Pull Request.

Na descrição do Pull Request, inclua uma seção curta chamada **Melhorias realizadas**, indicando as principais mudanças estruturais aplicadas.

Não envie alterações diretamente para a `master`.

## Materiais de apoio

- Playwright — API Testing: https://playwright.dev/docs/api-testing
- Playwright — Test Configuration: https://playwright.dev/docs/test-configuration
- Playwright — Fixtures: https://playwright.dev/docs/test-fixtures
- Playwright — Assertions: https://playwright.dev/docs/test-assertions
- Faker: https://fakerjs.dev/
- ServeRest: https://serverest.dev/
