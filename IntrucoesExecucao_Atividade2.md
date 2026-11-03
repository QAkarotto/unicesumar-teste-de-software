# Atividade 02 - 2º Bimestre: Evolução da Suíte de Testes de API com Playwright
  
**API Utilizada:** [ServeRest](https://serverest.dev/)  
**Tecnologias:** Playwright, TypeScript, Faker.js  

---

## Descrição do Projeto

Refatoração e evolução da suíte de testes automatizados da API do ServeRest:
- Centralização de configurações globais (`playwright.config.ts`);
- Reutilização e isolamento da autenticação via Fixture customizada;
- Geração dinâmica de dados únicos por execução usando `@faker-js/faker`;
- Organização do projeto por responsabilidades (factories, helpers, fixtures e specs);
- Validação avançada do estado dos recursos e regras de negócio.

---

## Como Instalar e Executar os Testes

1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:

`Node.js (versão 20 ou superior)`

2. Instalação das Dependências

Abra o terminal na pasta raiz do projeto e execute o comando abaixo para instalar todas as dependências (Playwright e Faker):
`npm install`
`npm install -D @faker-js/faker`

3. Comandos de Execução dos Testes
Abaixo estão os comandos nativos do Playwright para executar a suíte de testes de API:

- Executar apenas a suíte de testes de API (modo Headless):
`npx playwright test tests/api`

- Executar todos os testes do projeto:
`npx playwright test`

- Abrir a interface interativa do Playwright (Playwright UI - Recomendado para depuração):
`npx playwright test --ui`

- Gerar e abrir o relatório de execução HTML no navegador:
`npx playwright test --reporter=html`
`npx playwright show-report`

## Resumo das Melhorias Realizadas

- Centralização de Configurações: Definição da baseURL no playwright.config.ts, permitindo o uso de caminhos relativos em todas as requisições.

- Organização por Responsabilidade: Separação clara entre geração de dados (data/), lógica de autenticação (helpers/), dados injetados (fixtures/) e cenários (tests/api/).

- Autenticação Reutilizável: Criação da fixture authToken que provê tokens atualizados dinamicamente sem duplicar chamadas de login em cada cenário.

- Independência e Isolamento: Remoção de dependências entre sequências de testes; cada teste prepara suas próprias pré-condições.

- Geração Dinâmica de Dados: Uso da biblioteca @faker-js/faker para evitar erros de duplicidade ou registros pré-existentes.

- Asserções Completas: Verificação além do status HTTP, cobrindo mensagens de erro, identificadores (_id) e validação da integridade dos dados cadastrados no banco da API.

