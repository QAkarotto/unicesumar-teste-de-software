# Atividade 03 — Testes Unitários com Test Doubles

## 1. Objetivo

Esta atividade tem como objetivo desenvolver testes unitários utilizando o código-fonte do ServeRest, verificando o comportamento de funções em diferentes situações e aplicando os conceitos de Test Doubles.

## 2. Ferramentas utilizadas

- **Mocha:** framework responsável pela execução e organização dos testes.
- **Chai:** biblioteca utilizada para realizar as asserções e verificar os resultados esperados.
- **Sinon:** biblioteca utilizada para criar stubs, spies e mocks.
- **NYC:** ferramenta utilizada para gerar relatórios de cobertura dos testes.
- **ServeRest:** projeto utilizado como base para os testes unitários.

## 3. Conceitos de Test Doubles

- **Stub:** substitui o comportamento de uma dependência, permitindo definir resultados específicos para os testes.
- **Spy:** permite observar as chamadas de uma função, verificando quantas vezes ela foi executada e quais argumentos recebeu.
- **Mock:** permite definir expectativas para as chamadas de uma dependência e verificar se elas foram cumpridas.

## 4. Testes implementados

Foi criado o arquivo `test/unit/atividade-test-doubles.test.js`, contendo seis testes:

1. **Cálculo do preço total:** verifica se o valor total do carrinho é calculado corretamente com base nos preços e nas quantidades dos produtos.
2. **Carrinho vazio:** verifica se o preço total retorna zero quando não existem produtos.
3. **Consulta de preços bem-sucedida:** utiliza um stub para simular o retorno dos preços dos produtos.
4. **Erro na consulta de preços:** verifica se as informações do erro são preservadas corretamente.
5. **Falha em consulta externa:** utiliza um stub para simular uma falha de rede e um spy para verificar o registro do erro.
6. **Restauração do estoque:** utiliza um mock para verificar se a função responsável pela restauração do estoque é chamada com os argumentos esperados.

## 5. Como executar os testes

Para instalar as dependências do ServeRest, execute na raiz do repositório da disciplina:

```bash
npm --prefix serverest install
```

Para executar os testes unitários:

```bash
npm run test:unit
```

O comando utiliza o script configurado na raiz do projeto para executar a suíte de testes unitários do ServeRest.

## 6. Resultados

Na execução realizada durante o desenvolvimento, os testes unitários apresentaram **18 testes aprovados**, incluindo os seis testes criados para esta atividade.

Os testes de API existentes no repositório da disciplina também foram executados com sucesso, com seis testes aprovados.

## 7. Referências

- ServeRest: https://github.com/ServeRest/ServeRest
- Mocha: https://mochajs.org/
- Chai: https://www.chaijs.com/
- Sinon: https://sinonjs.org/
- NYC: https://github.com/istanbuljs/nyc
