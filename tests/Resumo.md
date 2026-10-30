# Playwright

## Comandos e funções

Rodar um teste de exemplo:
`npx playwright test`

`npx playwright test --headed`

Teste de Report:
`npx playwright show-report`




## Plano de testes

|#|Teste|Status|Cobre|
|---|---|---|---|
|1|Lista usuários|200|sucesso|
|2|Cadastrar usuário|201|sucesso|
|3|Cadastrar com e-mail já usado|400|inválido e regra de negócio|
|4|Login com dados certos|200|successo|
|5|Login com dados errados|401|inválido|
|6|Listra produtos|200|sucesso|