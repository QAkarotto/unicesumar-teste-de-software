const chai = require('chai')
const sinon = require('sinon')

const sandbox = sinon.createSandbox()
const service = require('../../src/services/carrinhos-service')
const produtosService = require('../../src/services/produtos-service')

describe('carrinhosService - Test Doubles', () => {
  afterEach(() => sandbox.restore())

  it('1 - precoTotal deve retornar zero quando não existem produtos', async () => {
    const resultado = await service.precoTotal([])

    chai.assert.equal(resultado, 0)
  })

  it('2 - deve retornar os preços unitários quando a consulta em lote funciona', async () => {
    const produtos = [{ idProduto: 'produto-1', quantidade: 2 }]
    const precos = [{ idProduto: 'produto-1', precoUnitario: 10 }]

    sandbox.stub(produtosService, 'getPrecosUnitariosPorLote')
      .resolves({ produtosComPreco: precos })

    const resultado = await service.getProdutosComPrecoUnitarioOuErro(produtos)

    chai.assert.deepEqual(resultado, {
      produtosComPrecoUnitario: precos
    })
  })

  it('3 - deve propagar o erro quando a consulta de preços falha', async () => {
    const produtos = [{ idProduto: 'produto-inexistente', quantidade: 1 }]
    const erro = {
      index: 0,
      item: { idProduto: 'produto-inexistente' },
      message: 'Produto não encontrado'
    }

    sandbox.stub(produtosService, 'getPrecosUnitariosPorLote')
      .resolves({ error: erro })

    const resultado = await service.getProdutosComPrecoUnitarioOuErro(produtos)

    chai.assert.deepEqual(resultado, {
      error: {
        ...erro,
        item: { ...erro.item, index: 0 }
      }
    })
  })

  it('4 - spy deve registrar a chamada e os argumentos enviados à consulta de preços', async () => {
    const produtos = [{ idProduto: 'produto-1', quantidade: 3 }]
    const spy = sandbox.spy()

    sandbox.stub(produtosService, 'getPrecosUnitariosPorLote')
      .callsFake(async (...args) => {
        spy(...args)
        return { produtosComPreco: [] }
      })

    await service.getProdutosComPrecoUnitarioOuErro(produtos)

    sinon.assert.calledOnce(spy)
    sinon.assert.calledWithExactly(spy, produtos)
  })

  it('5 - mock deve exigir a exclusão do carrinho ao concluir a compra', async () => {
    const carrinho = { _id: 'carrinho-123' }
    const mock = sandbox.mock(service)

    mock.expects('deleteById')
      .once()
      .withArgs('carrinho-123')

    await service.concluiCompra(carrinho)

    mock.verify()
  })

  it('6 - mock deve exigir a reposição do estoque e a exclusão ao remover o carrinho', async () => {
    const produtos = [{ idProduto: 'produto-1', quantidade: 2 }]
    const carrinho = { _id: 'carrinho-456', produtos }
    const mock = sandbox.mock(service)

    mock.expects('reabasteceEstoque')
      .once()
      .withArgs(produtos)

    mock.expects('deleteById')
      .once()
      .withArgs('carrinho-456')

    await service.removeCarrinho(carrinho)

    mock.verify()
  })
})
