# Atividade 03 – Testes Unitários com Test Doubles no ServeRest

**Disciplina:** Testes de Software – 2º Bimestre  
**Integrantes:** Luiz e Jefferson  
**Projeto de referência:** https://github.com/ServeRest/ServeRest

## 1. Pesquisa sobre Test Doubles

Test Doubles são objetos ou funções que substituem dependências reais durante testes unitários, permitindo verificar comportamentos isoladamente.

- **Stub:** controla o retorno de uma dependência, simulando resultados específicos sem executar sua implementação real.
- **Spy:** registra chamadas, argumentos e frequência de execução de uma função.
- **Mock:** estabelece expectativas sobre as interações com uma dependência e verifica se essas expectativas foram atendidas.

Essas técnicas permitem criar testes rápidos, independentes e sem necessidade de acessar serviços externos ou bancos de dados reais.

### Fontes consultadas

- https://sinonjs.org/
- https://sinonjs.org/releases/latest/stubs/
- https://sinonjs.org/releases/latest/spies/
- https://sinonjs.org/releases/latest/mocks/

## 2. Unidade testada

Serviço de carrinhos do ServeRest (`src/services/carrinhos-service.js`).

Foram implementados oito testes unitários:

1. Cálculo correto do preço total.
2. Retorno zero para carrinho vazio.
3. Identificação de produtos duplicados.
4. Controle do retorno da consulta de preços utilizando Stub.
5. Simulação de erro na consulta de preços utilizando Stub.
6. Verificação de chamadas e argumentos na atualização do estoque utilizando Spy.
7. Verificação da restauração do estoque utilizando Mock.
8. Propagação de erro na atualização do estoque utilizando Stub.

## 3. Justificativa dos Test Doubles

**Unidade testada:** `getProdutosComPrecoUnitarioOuErro`  
**Dependência substituída:** `produtosService.getPrecosUnitariosPorLote`  
**Test Double utilizado:** Stub  
**Motivo:** controlar os resultados da consulta de preços sem acessar a implementação real.

**Unidade testada:** `quantidadeTotal`  
**Dependência substituída:** `produtosService.updateQuantidadePorLote`  
**Test Double utilizado:** Spy associado a Stub  
**Motivo:** verificar se a atualização de estoque foi solicitada com os argumentos esperados, sem alterar dados reais.

**Unidade testada:** `reabasteceEstoque`  
**Dependência substituída:** `produtosService.restoreQuantidadePorLote`  
**Test Double utilizado:** Mock  
**Motivo:** estabelecer e verificar a expectativa de uma chamada para restauração do estoque.

## 4. Execução

Os testes foram desenvolvidos utilizando Mocha, Chai e Sinon, seguindo a estrutura original do ServeRest.

Para executar:

```bash
npm ci
npm run test:unit
```

O arquivo `atividade03-test-doubles.test.js` deve ser colocado na pasta `test/unit` do projeto ServeRest antes da execução.

## 5. Resultado

A execução local da suíte apresentou:

**20 testes aprovados, 0 falhas.**

Desse total, oito testes foram implementados especificamente para esta atividade.

A suíte foi executada com sucesso no GitHub Codespaces.
