# Instruções para a execução dos testes Playwright

 A pasta ```test/api``` possui o arquivo ```testesServeRest.spec.ts``` contendo os seguintes testes:

 - 1.Teste de criação de usuário: Validação de criação de usuário (HTTP 201)
 - 2.Teste de criação de usuário com email ja existente: Restrição de unicidade do e-mail (HTTP 400) ao tentar cadastrar o mesmo endereço duas vezes
 - 3.Teste de login: Validação de email e senha para realizar o login (HTTP 200)
 - 4.Teste de listagem de usuários: Retorno da lista de usuários (HTTP 200)
 - 5.Teste de cadastro de produto sem token: Proteção de rota privada (HTTP 401) garantindo que produtos não sejam criados sem autorização prévia.
 - 6.Teste de login com senha errada: Bloqueio de acesso com credenciais inválidas (HTTP 401) e validação da mensagem de erro tratada.
## Para executar os testes é necessário:

- Clonar o repositório:
  ```bash
    git clone https://github.com/QAkarotto/unicesumar-teste-de-software.git
    cd unicesumar-teste-de-software
  ```

- Instalar dependencias:
  
  ```bash
  npm install
  ```
- E executar com o comando:

  ```bash
  npx playwright test
  ```

  
