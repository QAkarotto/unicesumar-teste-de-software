# Instruções para atividade prática de Playwright envolvendo testes de API do Serverest.

## Nesta atividade nós elaboramos os seguintes 6 testes:

1. **Listar usuários com sucesso:** Realiza uma requisição GET para o endpoint `/usuarios`, validando o status HTTP 200, a presença da propriedade `usuarios` e se a quantidade retornada é maior ou igual a zero.
2. **Cadastrar um novo usuário com sucesso:** Envia uma requisição POST para `/usuarios` gerando um e-mail dinâmico, validando o status HTTP 201, a mensagem de sucesso e a criação do ID do usuário.
3. **Validação de Regra de Negócio (E-mail duplicado):** Tenta cadastrar dois usuários utilizando exatamente o mesmo endereço de e-mail, validando que a API bloqueia a duplicidade retornando o status HTTP 400 e a mensagem correspondente.
4. **Cenário Inválido (Produto inexistente):** Realiza uma requisição GET para `/produtos/` passando um ID incorreto ou inexistente, validando o status HTTP 400 e a mensagem de erro "Produto não encontrado".
5. **Listar produtos cadastrados:** Executa uma requisição GET para o endpoint `/produtos`, verificando o status HTTP 200 e checando a estrutura dos objetos retornados (nome, preço e quantidade).
6. **Validação de Regra de Negócio (Credenciais de login inválidas):** Envia uma requisição POST para `/login` utilizando uma senha incorreta, validando que a API rejeita o acesso com o status HTTP 401 e a mensagem de erro apropriada.

---

## Pré-rquisitos para executar:
1. Node versão 20 ou acima.

## Como clonar o repositório:
```bash
    git clone https://github.com/QAkarotto/unicesumar-teste-de-software.git
   cd unicesumar-teste-de-software
```

## Instale as dependências do projeto (se necessário):

```bash
    npm install
```

---

## Para executar os testes, é utilizado comandos do Playwright:

- Executar todos os testes:
```bash
npx playwright test
```

- Executar apenas os testes API:
```bash
npx playwright test tests/api
```

- Se quiser usar uma interface interativa, utilize:
```bash
npx playwright test --ui
```