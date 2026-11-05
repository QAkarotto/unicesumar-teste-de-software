# Evidência de execução

Execução: 04/11/2026, 21:27:37  
Front: https://front.serverest.dev  
API:   https://serverest.dev  
Node:  v24.20.0  

**Resultado: 5 de 5 testes passaram** (0 falha(s), 0 instável(is)).

| ID | Arquivo | Teste | Resultado | Duração |
| --- | --- | --- | --- | --- |
| CT01 | cenario1-cadastro-e-autenticacao.spec.ts | usuário comum se cadastra, faz login e acessa a área /home | passou | 6.7 s |
| CT02 | cenario1-cadastro-e-autenticacao.spec.ts | usuário administrador se cadastra, faz login e acessa a área /admin/home | passou | 6.3 s |
| CT03 | cenario2-cadastro-de-produto.spec.ts | administrador cadastra um produto e o encontra na listagem com os dados informados | passou | 7.1 s |
| CT04 | cenario3-login-invalido.spec.ts | login com e-mail não cadastrado é recusado | passou | 4.5 s |
| CT05 | cenario3-login-invalido.spec.ts | login com senha incorreta de um usuário existente é recusado | passou | 5.1 s |

Prints do estado final de cada teste em `screenshots/`. Saída completa do terminal em `execucao.txt`.
