Atividade 03 — Testes Unitários com Test Doubles no ServeRest

1. Objetivo

Analisar o código-fonte do ServeRest, identificar funções que possam ser testadas isoladamente e implementar testes unitários utilizando Test Doubles quando necessários para isolar dependências. A atividade contempla comportamentos esperados, cenários alternativos e de erro, além da utilização de stubs, spies e mocks.

2. Análise do código-fonte

Inicialmente, o projeto ServeRest foi clonado para o computador e suas dependências foram instaladas para permitir a execução dos testes. Durante a análise, foram identificados módulos que poderiam ser testados isoladamente. Inicialmente, foi explorado o módulo github-release.js. Em seguida, a análise foi direcionada ao serviço de carrinhos, por conter regras de negócio relacionadas ao cálculo de valores, à quantidade de produtos, à consulta de preços e à atualização do estoque.

O serviço selecionado foi:

src/services/carrinhos-service.js

O arquivo de testes utilizado foi:

test/unit/carrinhos-service.test.js

A escolha permitiu testar funções reais do ServeRest e substituir dependências externas nos cenários em que isso era necessário.

3. Testes implementados

Foram adicionados oito testes ao arquivo test/unit/carrinhos-service.test.js, contemplando os seguintes cenários:

ID, Unidade testada, Cenário e Test Double

1

precoTotal

Calcula o preço total dos produtos

Não necessário

2

quantidadeTotal

Calcula a quantidade total e solicita atualização do estoque

Stub

3

extrairProdutosDuplicados

Identifica produtos duplicados

Não necessário

4

extrairProdutosDuplicados

Retorna lista vazia quando não existem duplicados

Não necessário

5

getProdutosComPrecoUnitarioOuErro

Retorna os preços unitários encontrados

Stub

6

getProdutosComPrecoUnitarioOuErro

Trata e retorna informações de erro da consulta

Stub

7

concluiCompra

Solicita a exclusão do carrinho após a compra

Spy

8

removeCarrinho

Verifica a reposição do estoque e a exclusão do carrinho

Mock

4. Justificativa dos Test Doubles

Stub

O stub foi utilizado para substituir métodos do serviço de produtos, controlando seus retornos durante os testes.

Unidade testada: quantidadeTotal e getProdutosComPrecoUnitarioOuErro.

Dependência substituída: produtosService.updateQuantidadePorLote e produtosService.getPrecosUnitariosPorLote.

Test Double utilizado: Stub.

Motivo: controlar as respostas das dependências e testar o comportamento do serviço de carrinhos sem depender de atualizações reais de estoque ou de consultas reais de preços.

Spy

O spy foi utilizado para observar a chamada de exclusão solicitada por concluiCompra.

Unidade testada: concluiCompra.

Dependência observada: chamada ao método deleteById por meio de um observador.

Test Double utilizado: Spy.

Motivo: verificar se a exclusão foi solicitada com o identificador correto do carrinho.

Mock

O mock foi utilizado para definir expectativas sobre as interações de removeCarrinho.

Unidade testada: removeCarrinho.

Dependências verificadas: reabasteceEstoque e deleteById.

Test Double utilizado: Mock.

Motivo: verificar se a reposição do estoque e a exclusão do carrinho são solicitadas exatamente uma vez, com os argumentos esperados.

Testes sem Test Doubles

Os testes de precoTotal e extrairProdutosDuplicados verificam funções que podem ser executadas diretamente com dados controlados. Nesses casos, não foi necessário substituir dependências.

Essa abordagem evita o uso desnecessário de Test Doubles.

5. Execução dos testes

O projeto foi configurado e as dependências foram instaladas. No ambiente Windows com PowerShell, os comandos foram executados utilizando npm.cmd, devido à política de execução de scripts do terminal.

Comando utilizado:

npm.cmd run test:unit

O comando executa a suíte unitária configurada no projeto e gera o relatório de cobertura com o NYC.

6. Resultado obtido

Na execução final registrada durante o desenvolvimento, foram obtidos os seguintes resultados:

24 testes aprovados;

0 testes com falha;

Tempo de execução: 87 ms;

Cobertura geral de linhas: 65,49%;

Cobertura de linhas do serviço de carrinhos: 73,68%.

Os resultados demonstram que a suíte executou os testes sem falhas e que os novos testes ampliaram a cobertura do serviço de carrinhos.

A cobertura de linhas não representa, isoladamente, a garantia de ausência de defeitos. Ela indica a proporção de linhas executadas durante os testes.

7. Pesquisa e referências

A pesquisa sobre Test Doubles e suas aplicações foi apoiada pela documentação oficial do Sinon.js:

Sinon.js — documentação geral: https://sinonjs.org/

Stubs: https://sinonjs.org/concepts/stubs/

Spies: https://sinonjs.org/concepts/spies/

Mocks: https://sinonjs.org/concepts/mocks/

Essas referências descrevem os recursos utilizados para controlar dependências, observar chamadas e verificar expectativas de interação durante os testes.


9. Conclusão

A atividade permitiu praticar testes unitários no serviço de carrinhos do ServeRest, verificando cálculos, cenários alternativos, tratamento de erros e interações com dependências. Os stubs foram empregados para controlar retornos de serviços externos à unidade testada; o spy foi utilizado para observar uma chamada; e o mock verificou interações esperadas. As funções independentes foram testadas diretamente, sem substituições desnecessárias. A execução final registrada apresentou 24 testes aprovados e nenhuma falha. O código e a documentação serão encaminhados ao repositório da disciplina por meio de uma Pull Request direcionada à branch master.