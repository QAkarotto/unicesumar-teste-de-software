# Atividade 03 — Testes Unitários com Test Doubles no ServeRest

## 1. Objetivo

Implementar testes unitários no projeto ServeRest, verificando comportamentos esperados, cenários alternativos e situações de erro. Também foram utilizadas técnicas de Test Doubles para controlar dependências e verificar interações entre componentes.

## 2. Pesquisa sobre Test Doubles

Test Doubles são objetos ou substitutos utilizados em testes para representar dependências reais. Eles ajudam a isolar a unidade testada, controlar resultados e verificar interações, tornando os testes mais previsíveis e independentes.

### Stub

Um stub substitui uma dependência e fornece um retorno previamente definido. É útil quando o teste precisa controlar o resultado de uma operação externa à unidade testada.

Nesta atividade, foi utilizado para substituir a atualização do estoque e evitar a execução real dessa dependência.

### Spy

Um spy permite observar as chamadas de uma função, incluindo a quantidade de chamadas e os argumentos utilizados. É útil quando precisamos verificar se uma interação ocorreu.

O Sinon oferece recursos de observação de chamadas também em seus stubs. Nesta implementação, a verificação de chamadas e argumentos é realizada sem executar a operação real no banco de dados.

### Mock

Um mock permite estabelecer expectativas sobre as interações com uma dependência, como a função chamada, os argumentos utilizados e a quantidade de chamadas esperadas.

Nesta atividade, foi utilizado para verificar se a restauração do estoque é solicitada com a lista de produtos esperada.

## 3. Testes implementados

Os testes foram desenvolvidos no arquivo `carrinhos-service.test.js`.

1. **Cálculo do preço total:** verifica o cálculo do preço total de uma lista de produtos.
2. **Cálculo da quantidade total com stub:** verifica a soma das quantidades e substitui a atualização real do estoque.
3. **Cenário alternativo:** verifica se uma lista vazia resulta em preço total igual a zero.
4. **Cenário de erro:** verifica a propagação de um erro retornado pelo serviço de produtos.
5. **Verificação de chamadas e argumentos:** verifica se `concluiCompra` solicita a exclusão do carrinho com o identificador esperado, sem executar a operação real.
6. **Mock:** verifica se `reabasteceEstoque` solicita a restauração do estoque com a lista de produtos esperada.

## 4. Tecnologias utilizadas

- Node.js
- Mocha
- Chai
- Sinon
- NYC

## 5. Como executar

Os testes foram desenvolvidos na estrutura de testes unitários do ServeRest.

Para executá-los, clone o projeto de referência, instale as dependências e execute:

```bash
npm install
npm run test:unit
```

A versão utilizada nesta atividade foi a 3.2.2 do ServeRest.

Projeto de referência: https://github.com/ServeRest/ServeRest

## 6. Evidência de execução

Após a execução da suíte de testes, registre o resultado apresentado pelo terminal e salve-o na pasta `evidencias`.

A evidência deve corresponder à execução efetiva dos testes após as alterações finais.

## 7. Referências

- ServeRest: https://github.com/ServeRest/ServeRest
- Sinon: https://sinonjs.org/
- Sinon — Stubs: https://sinonjs.org/releases/latest/stubs/
- Sinon — Spies: https://sinonjs.org/releases/latest/spies/
- Sinon — Mocks: https://sinonjs.org/releases/latest/mocks/
- Mocha: https://mochajs.org/
- Chai: https://www.chaijs.com/