'use strict'

const { assert } = require('chai')
const sinon = require('sinon')
const axios = require('axios')

const sandbox = sinon.createSandbox()

const carrinhosService = require('../../src/services/carrinhos-service')
const produtosService = require('../../src/services/produtos-service')
const getRandomFinancialContributor = require('../../src/utils/getRandomFinancialContributor')
const logger = require('../../src/utils/logger')

describe('Atividade 03 - Test Doubles', () => {
  afterEach(() => sandbox.restore())

  it('01 - Deve calcular corretamente o preço total do carrinho', async () => {
    const produtos = [
      { precoUnitario: 10, quantidade: 2 },
      { precoUnitario: 5, quantidade: 3 }
    ]

    const resultado = await carrinhosService.precoTotal(produtos)

    assert.strictEqual(resultado, 35)
  })

  it('02 - Deve retornar zero quando o carrinho estiver vazio', async () => {
    const resultado = await carrinhosService.precoTotal([])

    assert.strictEqual(resultado, 0)
  })

  it('03 - Deve retornar os preços quando a consulta em lote for bem-sucedida', async () => {
    const produtos = [{ idProduto: 'produto-1', quantidade: 2 }]

    const produtosComPreco = [
      {
        idProduto: 'produto-1',
        quantidade: 2,
        precoUnitario: 15
      }
    ]

    const stub = sandbox
      .stub(produtosService, 'getPrecosUnitariosPorLote')
      .resolves({ produtosComPreco, error: null })

    const resultado =
      await carrinhosService.getProdutosComPrecoUnitarioOuErro(produtos)

    assert.deepEqual(resultado, {
      produtosComPrecoUnitario: produtosComPreco
    })

    sinon.assert.calledOnceWithExactly(stub, produtos)
  })

  it('04 - Deve preservar as informações quando a consulta retorna um erro', async () => {
    const produtos = [{ idProduto: 'inexistente', quantidade: 1 }]

    const erro = {
      message: 'Produto não encontrado',
      index: 0,
      item: { idProduto: 'inexistente' }
    }

    sandbox
      .stub(produtosService, 'getPrecosUnitariosPorLote')
      .resolves({ produtosComPreco: null, error: erro })

    const resultado =
      await carrinhosService.getProdutosComPrecoUnitarioOuErro(produtos)

    assert.deepEqual(resultado, {
      error: {
        message: 'Produto não encontrado',
        index: 0,
        item: { idProduto: 'inexistente', index: 0 }
      }
    })
  })

  it('05 - Deve registrar o erro quando a consulta externa falha', async () => {
    sandbox.stub(axios, 'get').rejects(new Error('Network error'))

    const loggerSpy = sandbox.spy(logger, 'log')

    await getRandomFinancialContributor()

    sinon.assert.calledOnceWithExactly(loggerSpy, {
      level: 'error',
      message: 'Failed to get financial contributor.'
    })
  })

  it('06 - Deve solicitar a restauração do estoque uma vez', async () => {
    const produtos = [
      { idProduto: 'produto-1', quantidade: 2 },
      { idProduto: 'produto-2', quantidade: 1 }
    ]

    const mock = sandbox.mock(produtosService)

    mock
      .expects('restoreQuantidadePorLote')
      .once()
      .withArgs(produtos)
      .resolves()

    await carrinhosService.reabasteceEstoque(produtos)

    mock.verify()
  })
})
