# Atividade 04 – Testes Automatizados End-to-End (E2E) com Playwright

## 1. Introdução e objetivo

A proposta desta atividade consiste na implementação de testes automatizados End-to-End (E2E) com a ferramenta Playwright, tendo como finalidade avaliar o comportamento da aplicação ServeRest por meio de interações realizadas diretamente na interface web.

A automação contempla funcionalidades relacionadas ao registro de usuários, autenticação no sistema e gerenciamento de produtos. Dessa maneira, busca-se reproduzir situações semelhantes às operações realizadas por usuários durante a utilização da aplicação.

**Frontend testado:** https://front.serverest.dev/

**API utilizada:** https://serverest.dev/

## 2. Ferramentas e tecnologias

Durante o desenvolvimento dos testes, foram utilizadas as seguintes tecnologias:

- **Node.js:** ambiente responsável pela execução dos códigos JavaScript e TypeScript.
- **TypeScript:** linguagem utilizada para estruturar e implementar os testes automatizados.
- **Playwright:** ferramenta responsável pela automação do navegador e execução dos cenários E2E.
- **ServeRest:** aplicação utilizada como objeto de teste.
- **Git e GitHub:** ferramentas empregadas para versionamento e armazenamento do código-fonte.

## 3. Organização dos arquivos

Os arquivos relacionados à automação foram distribuídos em diretórios específicos, facilitando a identificação dos cenários e o reaproveitamento dos recursos utilizados nos testes.

```text
tests/
└── web/
    ├── fixtures/
    │   └── admin.fixture.ts
    ├── cadastro-produto.spec.ts
    ├── cadastro-usuario.spec.ts
    └── login-invalido.spec.ts

READMEATIV4.md
```

### Finalidade dos arquivos

- **admin.fixture.ts:** implementa uma fixture personalizada que prepara o acesso administrativo. Para isso, cria um usuário administrador por meio da API e realiza sua autenticação pelo frontend.
- **cadastro-produto.spec.ts:** automatiza o preenchimento e envio do formulário de cadastro de produtos, além de verificar se o novo registro aparece na listagem.
- **cadastro-usuario.spec.ts:** simula o registro de um usuário comum e, posteriormente, realiza uma tentativa de autenticação com os dados informados.
- **login-invalido.spec.ts:** avalia a resposta da aplicação quando são fornecidas credenciais incorretas, verificando se o acesso é bloqueado.

## 4. Implementação dos cenários de teste

### 4.1 Registro de usuário e validação do acesso

O primeiro teste tem como finalidade verificar se um novo usuário consegue realizar seu cadastro e, posteriormente, acessar o sistema utilizando as credenciais criadas.

O fluxo automatizado contempla:

1. Abertura da página inicial do ServeRest.
2. Navegação até a funcionalidade de cadastro.
3. Preenchimento das informações solicitadas, incluindo nome, e-mail e senha.
4. Envio dos dados para concluir o registro.
5. Retorno à página de autenticação.
6. Inserção do e-mail e da senha utilizados no cadastro.
7. Verificação do resultado da autenticação e do acesso à área correspondente ao perfil do usuário.

Para garantir que as execuções não interfiram umas nas outras, o teste utiliza endereços de e-mail gerados dinamicamente, evitando problemas relacionados à duplicidade de registros.

### 4.2 Registro e consulta de produtos

O segundo teste é direcionado à funcionalidade de gerenciamento de produtos, verificando se um administrador consegue cadastrar um novo item e encontrá-lo posteriormente na listagem.

Para facilitar a preparação desse cenário, foi desenvolvida uma fixture específica para o perfil administrativo.

O procedimento realizado é composto pelas seguintes ações:

1. Preparação de uma conta administrativa por meio de uma requisição à API.
2. Acesso à aplicação web e realização do login com as credenciais dessa conta.
3. Abertura da página destinada ao cadastro de produtos.
4. Preenchimento dos campos referentes ao nome, preço, descrição e quantidade.
5. Confirmação do cadastro pela interface.
6. Navegação até a página de consulta dos produtos.
7. Verificação da existência do produto recém-cadastrado.

Assim como no cenário anterior, são utilizados dados dinâmicos para identificar o produto, reduzindo a possibilidade de conflitos entre diferentes execuções.

### 4.3 Tentativa de autenticação com dados incorretos

O terceiro cenário tem como objetivo avaliar se o mecanismo de autenticação impede a entrada de usuários que informam credenciais inválidas.

Para realizar essa verificação, o teste executa as seguintes etapas:

1. Acesso à tela de login da aplicação.
2. Preenchimento do campo de e-mail com um endereço inexistente.
3. Inserção de uma senha incorreta.
4. Envio do formulário de autenticação.
5. Identificação e validação da mensagem de erro exibida.
6. Confirmação de que a aplicação não permite o acesso à área restrita.

Esse procedimento permite verificar se o sistema apresenta o tratamento esperado para tentativas de acesso sem credenciais válidas.

## 5. Utilização de fixture personalizada

No teste de cadastro de produtos, foi adotado o recurso `test.extend()` disponibilizado pelo Playwright para implementar uma fixture denominada `adminPage`.

Sua principal finalidade é centralizar a preparação da sessão administrativa, disponibilizando uma página já autenticada para os testes que necessitam desse tipo de permissão.

O funcionamento dessa estrutura envolve duas etapas principais:

- **Preparação do ambiente:** criação de um usuário com privilégios administrativos por meio de uma chamada à API do ServeRest.
- **Autenticação e disponibilização da página:** utilização das credenciais criadas para realizar o login pela interface web. Após a validação do acesso, a página autenticada é disponibilizada ao cenário de teste.

A utilização dessa abordagem torna a implementação mais organizada, evita a repetição de procedimentos de autenticação e permite separar as etapas de preparação do ambiente das ações efetivamente verificadas pela automação.

## 6. Instruções para execução

Para executar os testes, é necessário possuir o Node.js instalado e as dependências do projeto devidamente configuradas.

Caso seja necessário instalar as dependências, utilize:

```bash
npm install
```

O navegador Chromium utilizado pelo Playwright pode ser instalado com:

```bash
npx playwright install chromium
```

Para iniciar a execução dos testes pertencentes ao projeto web, utilize:

```bash
npx playwright test --project=web
```

Caso seja necessário acompanhar as interações diretamente no navegador, os testes podem ser executados em modo visível, utilizando:

```bash
npx playwright test --project=web --workers=1 --headed
```

## 7. Resultados da automação

Após o desenvolvimento dos cenários e os ajustes realizados nos seletores dos componentes da interface, foi possível executar os testes automatizados com os resultados esperados.

O desempenho dos cenários foi o seguinte:

| Cenário | Resultado |
|---|---|
| Cadastro e autenticação de usuário | Aprovado |
| Cadastro e consulta de produtos | Aprovado |
| Autenticação com credenciais inválidas | Aprovado |

**Resultado geral: 3 testes aprovados.**

Os resultados demonstram que os fluxos automatizados conseguiram validar as funcionalidades propostas, incluindo o cadastro de informações, o acesso ao sistema e o tratamento de tentativas de autenticação inválidas.


## 8. Repositório e versionamento

Os arquivos desenvolvidos para esta atividade foram disponibilizados no repositório do GitHub:

https://github.com/QAkarotto/unicesumar-teste-de-software

**Branch utilizada:** `gabriel-matheus-atividade4`

O versionamento foi realizado utilizando Git, permitindo organizar as alterações e disponibilizar a implementação para avaliação por meio do repositório remoto.