# Atividade 04 - Automação de Testes E2E com Playwright Objetivo
Testes automatizados End-to-End utilizando Playwright, validando jornadas de usuários na interface web do ServeRest.

## Instruções de execução dos testes
Abra o terminal na pasta raiz do projeto e execute.

### Requisição para o funcionamento dos testes E2E

- Instalar as dependências do projeto:
Abra o terminal na pasta raiz do projeto e execute.
´´´
npm install
´´´

- Instalar o Playwright
Para verificar se o Playwright está instalado corretamente, execute.
´´´
npx playwright --version
´´´

- Instalar o navegador Chromium:
Execute o comando abaixo para instalar o navegador utilizado nos testes E2E.
´´´
npx playwright install chromium
´´´

### Execução dos testes
- Executar os testes E2E e visualizar as interações realizadas automaticamente pelo Playwright no navegador:
´´´
npm run test:e2e
´´´

- Executar um cenário específico
Executar os testes E2E e visualizar as interações realizadas automaticamente pelo Playwright no navegador de modo individual.
´´´
npx playwright test tests/web/cadastro-login.spec.js
´´´
´´´
npx playwright test tests/web/cadastro-produto.spec.js
´´´
´´´
npx playwright test tests/web/login-invalido.spec.js
´´´

- Abrir a interface interativa:
´´´
npm run test:e2e:ui
´´´

-Visualizar o relatório:
Após a execução, para abrir o relatório HTML do Playwright, execute.
´´´
npm run test:e2e:report
´´´

## Evidências da execução

Os arquivos gerados durante a execução ficam organizados nos seguintes diretórios:

- playwright-report/: relatório HTML dos testes.

- test-results/: resultados das execuções, capturas de tela e traces, conforme a configuração do Playwright.

#### Execute os comandos a partir da pasta raiz do projeto. Certifique-se de que as dependências e o navegador Chromium estejam instalados antes de iniciar os testes.