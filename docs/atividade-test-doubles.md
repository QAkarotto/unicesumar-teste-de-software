\# Atividade - Test Doubles - ServeRest



\## Repositório da implementação



A implementação dos testes unitários foi realizada no fork do projeto ServeRest:



Pull Request:

https://github.com/charlesbruno7/ServeRest/pull/541



\## Pesquisa - Test Doubles



Test Doubles são objetos utilizados em testes para substituir dependências reais da unidade testada.



Eles permitem isolar o comportamento de uma unidade, evitando dependências externas como banco de dados, APIs ou outros serviços.



São utilizados principalmente para:



\- controlar retornos de dependências;

\- verificar interações entre objetos;

\- tornar testes mais rápidos e independentes.





\## Tipos utilizados



\### Stub



Um stub substitui uma dependência retornando valores controlados.



Foi utilizado para substituir chamadas reais ao serviço de produtos durante testes de atualização de estoque.



Exemplo:



\- Dependência substituída:

&#x20; produtosService.updateQuantidadePorLote



\- Objetivo:

&#x20; evitar alteração real no estoque durante o teste.





\### Spy



Um spy permite observar se uma função foi chamada e quais argumentos recebeu.



Foi utilizado para verificar se o serviço de reposição de estoque foi executado.



Exemplo:



\- Dependência observada:

&#x20; produtosService.restoreQuantidadePorLote



\- Validação:

&#x20; confirmar que a função foi chamada uma vez.





\### Mock



Um mock cria uma expectativa sobre uma dependência.



Foi utilizado para validar que o serviço de produtos foi chamado com os argumentos esperados.



Exemplo:



\- Dependência:

&#x20; produtosService.getPrecosUnitariosPorLote



\- Validação:

&#x20; método chamado uma vez com os parâmetros corretos.





\## Unidade testada



Serviço:



src/services/carrinhos-service.js





\## Testes implementados



Arquivo:



test/unit/carrinhos-service-test-double.test.js





Foram implementados testes para:



\- cálculo do preço total do carrinho;

\- identificação de produtos duplicados;

\- tratamento de erro vindo do serviço de produtos;

\- atualização de quantidade utilizando stub;

\- reposição de estoque utilizando spy;

\- validação de interação utilizando mock.





\## Execução



Comando utilizado:



npm run test:unit





Resultado:



18 testes executados com sucesso.



Resultado obtido:



18 passing





\## Conclusão



A utilização de Test Doubles permitiu testar o serviço de carrinhos de forma isolada, substituindo dependências externas quando necessário e validando comportamentos específicos da unidade testada.

