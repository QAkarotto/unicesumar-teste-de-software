\# Atividade 03 — Testes Unitários com Test Doubles



\*\*Integrantes:\*\* Victor da Mata e Nicolas Moreira



\## Objetivo



Implementar seis testes unitários no projeto ServeRest, utilizando Sinon para criar Test Doubles e isolar dependências quando necessário.



\## Testes implementados



1\. `busca-usuario.test.js` — comportamento esperado.

2\. `campo-nao-convertido.test.js` — cenário alternativo.

3\. `cenario-erro.test.js` — tratamento de erro.

4\. `stub.test.js` — retorno controlado de dependência.

5\. `spy.test.js` — observação de chamadas.

6\. `mock.test.js` — verificação de interação esperada.



\## Execução



Os testes foram implementados sobre o ServeRest versão 3.2.2.



Para reproduzir a execução:



1\. Clonar o repositório `https://github.com/ServeRest/ServeRest.git`.

2\. Entrar na pasta `ServeRest`.

3\. Executar `git checkout v3.2.2`.

4\. Aplicar o arquivo `testes.patch` fornecido nesta entrega usando `git apply caminho/para/testes.patch`.

5\. Executar `npm install`.

6\. Executar `npm run test:unit`.



\## Resultado obtido



\- Testes originais: 12

\- Testes adicionados: 6

\- Total: \*\*18 testes aprovados\*\*

\- Falhas: 0



\## Test Doubles utilizados



\*\*Stub:\*\* controla o retorno da consulta de preços dos produtos.



\*\*Spy:\*\* observa a chamada de reabastecimento do estoque.



\*\*Mock:\*\* estabelece e verifica a expectativa de exclusão de um carrinho.



\## Referências



\- https://martinfowler.com/bliki/TestDouble.html

\- https://sinonjs.org/releases/latest/stubs/

\- https://sinonjs.org/releases/latest/spies/

\- https://sinonjs.org/releases/latest/mocks/

