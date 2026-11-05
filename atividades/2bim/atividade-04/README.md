Atividade 04 – 2BIM: Testes E2E com Playwright
Objetivo: Desenvolver testes automatizados de ponta a ponta (End-to-End) utilizando Playwright e JavaScript, verificando funcionalidades da interface do ServeRest.



Aplicação testada: https://front.serverest.dev/



Tecnologias utilizadas
Node.js
JavaScript
Playwright
@playwright/test
Chromium


Estrutura do projeto
atividade-04/
├── tests/
│   ├── e2e/
│   │   ├── usuario.spec.js
│   │   ├── admin.spec.js
│   │   └── login-invalido.spec.js
│   └── fixtures/
│       └── admin.fixture.js
├── evidencias/
│   ├── 01-execucao-completa.png
│   ├── 02-relatorio-playwright.png
│   ├── 03-usuario-autenticado.png
│   ├── 04-produto-cadastrado.png
│   └── 05-login-invalido.png
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.js
└── README.md

Cenários automatizados

1\. Cadastro e autenticação de usuário
Acessa a tela de cadastro.
Preenche os dados de um novo usuário.
Confirma a mensagem de sucesso.
Acessa a tela de login.
Realiza a autenticação.
Verifica o retorno da API e a existência do token de autorização.
2\. Cadastro de produto como administrador
Utiliza uma fixture personalizada com test.extend().
Cria um administrador pela API como preparação.
Realiza a autenticação pela interface.
Acessa o formulário de produtos.
Preenche os dados e envia uma imagem.
Cadastra o produto pela interface.
Verifica se o produto aparece na listagem.
3\. Login com credenciais inválidas
Acessa a tela de login.
Informa credenciais incorretas.
Verifica a resposta de acesso não autorizado.
Confirma a mensagem de erro.
Verifica que o usuário permanece na tela de login.


Instalação
É necessário ter Node.js instalado.
Na pasta da atividade, execute:
npm install
npx playwright install chromium
Execução dos testes
Executar todos os testes:
npx playwright test
Executar um arquivo específico:
npx playwright test tests/e2e/usuario.spec.js
Abrir o relatório HTML:
npx playwright show-report


Observações
Os testes utilizam seletores data-testid sempre que disponíveis.
Os dados de usuários e produtos são gerados dinamicamente para evitar conflitos entre execuções.
A API é utilizada como preparação para a criação do administrador. As principais ações dos cenários são realizadas pela interface gráfica, conforme a proposta de testes E2E.

