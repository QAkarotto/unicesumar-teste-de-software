# Atividade 03 — Testes Unitários com Test Doubles no ServeRest

## 1. Objetivo

Implementar testes unitários para métodos do serviço de carrinhos do ServeRest, isolando dependências e verificando retornos, tratamento de erros e interações entre métodos.

## 2. Pesquisa sobre Test Doubles

Test Doubles são objetos ou funções substitutos usados nos testes para isolar a unidade testada de suas dependências.

- **Stub:** substitui uma dependência e permite controlar o resultado retornado.
- **Spy:** registra informações sobre chamadas de uma função, incluindo quantidade de chamadas e argumentos.
- **Mock:** permite definir expectativas de interação com uma dependência e verificar se foram atendidas.

### Fontes consultadas

- Sinon.js: https://sinonjs.org/
- Stubs: https://sinonjs.org/releases/latest/stubs/
- Spies: https://sinonjs.org/releases/latest/spies/
- Mocks: https://sinonjs.org/releases/latest/mocks/
- Projeto ServeRest: https://github.com/ServeRest/ServeRest

## 3. Testes implementados

### 1. Consulta de produtos com preços unitários
- **Unidade testada:** `getProdutosComPrecoUnitarioOuErro`.
- **Dependência substituída:** `produtosService.getPrecosUnitariosPorLote`.
- **Test Double utilizado:** Stub.
- **Motivo:** controlar o retorno da dependência e verificar o resultado e os argumentos da chamada.

### 2. Tratamento de erro na consulta de preços
- **Unidade testada:** `getProdutosComPrecoUnitarioOuErro`.
- **Dependência substituída:** `produtosService.getPrecosUnitariosPorLote`.
- **Test Double utilizado:** Stub.
- **Motivo:** validar o tratamento do erro retornado e a inclusão do índice do produto.

### 3. Soma das quantidades
- **Unidade testada:** `quantidadeTotal`.
- **Dependência substituída:** `produtosService.updateQuantidadePorLote`.
- **Test Double utilizado:** Stub.
- **Motivo:** controlar a resposta da dependência e validar a soma das quantidades e os argumentos utilizados.

### 4. Reposição do estoque
- **Unidade testada:** `reabasteceEstoque`.
- **Dependência substituída:** `produtosService.restoreQuantidadePorLote`.
- **Test Double utilizado:** Stub.
- **Motivo:** verificar a chamada da dependência com os produtos esperados, sem depender da atualização real do banco.

### 5. Conclusão da compra
- **Unidade testada:** `concluiCompra`.
- **Dependência substituída:** `service.deleteById`.
- **Test Double utilizado:** Mock.
- **Motivo:** verificar a expectativa de que a exclusão do carrinho seja chamada uma única vez com o identificador correto.

### 6. Ordem das operações de remoção
- **Unidade testada:** `removeCarrinho`.
- **Dependências substituídas:** `service.reabasteceEstoque` e `service.deleteById`.
- **Test Double utilizado:** Stubs.
- **Motivo:** verificar se a reposição do estoque acontece antes da exclusão do carrinho.

### 7. Verificação das chamadas com Spy
- **Unidade testada:** `removeCarrinho`.
- **Dependências substituídas:** `service.deleteById` e `produtosService.restoreQuantidadePorLote`.
- **Test Double utilizado:** Spy e Stubs.
- **Motivo:** observar a chamada de `reabasteceEstoque`, conferir os argumentos e verificar as interações com as dependências substituídas.

## 4. Como executar

Na raiz do projeto ServeRest, execute:

```bash
npm run test:unit
```

## 5. Evidência de execução

Na execução realizada durante o desenvolvimento, o resultado foi **19 passing**. A captura de tela do terminal deve ser anexada à entrega para comprovar a execução final.

## 6. Conclusão

Os testes verificam comportamentos relevantes do serviço de carrinhos e demonstram o uso de stubs, spies e mocks para controlar retornos, observar chamadas e validar expectativas de interação.