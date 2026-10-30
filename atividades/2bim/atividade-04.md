# Atividade 04 - 2BIM: Automação de Testes E2E com Playwright

## Objetivo

Implementar testes automatizados End-to-End (E2E) com Playwright, validando jornadas de usuário no frontend do ServeRest e aplicando boas práticas de automação, organização e reutilização de código.

## Contexto

O [ServeRest Front](https://front.serverest.dev/) simula uma aplicação de comércio eletrônico, com funcionalidades de autenticação e gerenciamento de usuários e produtos.

Nesta atividade, os testes deverão interagir com a aplicação por meio do navegador, verificando os comportamentos observados pelo usuário.

## Desenvolvimento

Utilizando Playwright e JavaScript ou TypeScript, implemente os **três cenários E2E obrigatórios**:

### Cenário 1: Cadastro e autenticação de usuário

- Cadastrar um novo usuário pela interface.
- Realizar a autenticação com as credenciais cadastradas.
- Validar que o usuário acessou a área correspondente ao seu perfil.

### Cenário 2: Cadastro de produto pelo administrador

- Utilizar uma fixture para disponibilizar uma página autenticada como administrador.
- Cadastrar um produto pela interface.
- Acessar a listagem de produtos.
- Verificar que o produto cadastrado está disponível com os dados esperados.

### Cenário 3: Autenticação com credenciais inválidas

- Informar credenciais inválidas na tela de login.
- Tentar realizar a autenticação.
- Validar a mensagem de erro apresentada.
- Verificar que o acesso à área autenticada não foi permitido.

## Requisitos técnicos

- Utilizar `@playwright/test` com `test` e `expect`.
- Organizar os cenários em arquivos `.spec.js` ou `.spec.ts`.
- Priorizar seletores `data-testid`, utilizando `page.getByTestId()`.
  - Exemplo: `page.getByTestId('email').fill('teste@email.com')`.
- **Criar uma fixture personalizada com `test.extend()`** para preparar a autenticação do administrador e fornecer uma página autenticada ao teste de cadastro de produto.
- Separar a preparação dos cenários das ações que representam o comportamento testado.
- Implementar asserções que comprovem os resultados esperados.
- Gerar dados únicos para evitar conflitos entre execuções.
- Garantir a independência dos testes.
- Evitar esperas fixas, como `waitForTimeout()`.

É permitido utilizar requisições de API para preparar dados e pré-condições. Entretanto, **as ações principais de cada cenário deverão ocorrer pela interface web**.

## Entrega

Realizar a entrega por Pull Request no repositório da disciplina, contendo:

1. Os três cenários E2E implementados.
2. A fixture personalizada para autenticação.
3. Instruções de execução no README.
4. Evidência da execução dos testes, com seus resultados.

## Critérios de avaliação

Serão considerados a implementação dos três cenários obrigatórios, a utilização adequada de fixtures, a qualidade das asserções, o uso de seletores estáveis, a organização do código e a independência dos testes.
