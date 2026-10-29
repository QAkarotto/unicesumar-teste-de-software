const chai = require('chai')
const sandbox = require('sinon').createSandbox()

const service = require('../../src/services/carrinhos-service')
const produtosService = require('../../src/services/produtos-service')

describe('carrinhosService', () => {
  afterEach(() => sandbox.restore())

  it('precoTotal - Deve retornar o preço corretamente de acordo com a quantidade de produtos e preço unitário', async () => {
    const produtos = [
      {
        idProduto: '12345678',
        quantidade: 1,
        precoUnitario: 10
      },
      {
        idProduto: '87654321',
        quantidade: 5,
        precoUnitario: 20
      },
      {
        idProduto: 'abc45678',
        quantidade: 11,
        precoUnitario: 2
      }
    ]

    const precoTotal = await service.precoTotal(produtos)

    chai.assert.equal(precoTotal, 132)
  })

  it('quantidadeTotal - Deve retornar a quantidade total corretamente de acordo com a quantidade de cada produto e reduzir o estoque 3 vezes', async () => {
    const produtos = [
      {
        idProduto: '12345678',
        quantidade: 3,
        precoUnitario: 10
      },
      {
        idProduto: '87654321',
        quantidade: 105,
        precoUnitario: 20
      },
      {
        idProduto: 'abc45678',
        quantidade: 11,
        precoUnitario: 2
      }
    ]

    sandbox.stub(produtosService, 'updateQuantidadePorLote').returns({})

    const quantidadeTotal = await service.quantidadeTotal(produtos)

    chai.assert.equal(quantidadeTotal, 119)
    sandbox.assert.calledOnce(produtosService.updateQuantidadePorLote)
  })

  it('getProdutosComPrecoUnitarioOuErro - Deve retornar os produtos com preços unitários', async () => {
    const produtos = [
      { idProduto: '12345678', quantidade: 2 }
    ]

    const produtosComPreco = [
      { idProduto: '12345678', quantidade: 2, precoUnitario: 15 }
    ]

    const stub = sandbox
      .stub(produtosService, 'getPrecosUnitariosPorLote')
      .resolves({ produtosComPreco })

    const resultado = await service.getProdutosComPrecoUnitarioOuErro(produtos)

    chai.assert.deepEqual(resultado, {
      produtosComPrecoUnitario: produtosComPreco
    })

    sandbox.assert.calledOnceWithExactly(stub, produtos)
  })

  it('getProdutosComPrecoUnitarioOuErro - Deve preservar o erro e incluir o índice do produto', async () => {
    const produtos = [
      { idProduto: 'produto-inexistente', quantidade: 2 }
    ]

    const erroEsperado = {
      statusCode: 400,
      message: 'Produto não encontrado',
      item: {
        idProduto: 'produto-inexistente',
        quantidade: 2,
        index: 0
      },
      index: 0
    }

    const stub = sandbox
      .stub(produtosService, 'getPrecosUnitariosPorLote')
      .resolves({
        error: {
          statusCode: 400,
          message: 'Produto não encontrado',
          item: {
            idProduto: 'produto-inexistente',
            quantidade: 2
          },
          index: 0
        }
      })

    const resultado = await service.getProdutosComPrecoUnitarioOuErro(produtos)

    chai.assert.deepEqual(resultado, {
      error: erroEsperado
    })

    sandbox.assert.calledOnceWithExactly(stub, produtos)
  })


  it('quantidadeTotal - Deve retornar a soma das quantidades e chamar a dependência com os produtos', async () => {
    const produtos = [
      { idProduto: 'produto-1', quantidade: 2, precoUnitario: 10 },
      { idProduto: 'produto-2', quantidade: 3, precoUnitario: 20 }
    ]

    const stub = sandbox
      .stub(produtosService, 'updateQuantidadePorLote')
      .resolves({})

    const quantidadeTotal = await service.quantidadeTotal(produtos)

    chai.assert.equal(quantidadeTotal, 5)
    sandbox.assert.calledOnceWithExactly(stub, produtos)
  })

  it('reabasteceEstoque - Deve chamar a dependência para restaurar o estoque', async () => {
    const produtos = [
      { idProduto: 'produto-1', quantidade: 2 },
      { idProduto: 'produto-2', quantidade: 3 }
    ]

    const stub = sandbox
      .stub(produtosService, 'restoreQuantidadePorLote')
      .resolves({})

    await service.reabasteceEstoque(produtos)

    sandbox.assert.calledOnceWithExactly(stub, produtos)
  })



  it('concluiCompra - Deve excluir o carrinho pelo identificador usando mock', async () => {
    const carrinho = {
      _id: 'carrinho-123',
      produtos: []
    }

    const mock = sandbox.mock(service)

    mock
      .expects('deleteById')
      .once()
      .withExactArgs('carrinho-123')
      .resolves(1)

    await service.concluiCompra(carrinho)

    mock.verify()
  })


  it('removeCarrinho - Deve restaurar o estoque antes de excluir o carrinho', async () => {
    const carrinho = {
      _id: 'carrinho-456',
      produtos: [
        { idProduto: 'produto-1', quantidade: 2 }
      ]
    }

    const ordemChamadas = []

    const stubEstoque = sandbox
      .stub(service, 'reabasteceEstoque')
      .callsFake(async produtos => {
        ordemChamadas.push('estoque')
        chai.assert.deepEqual(produtos, carrinho.produtos)
      })

    const stubExclusao = sandbox
      .stub(service, 'deleteById')
      .callsFake(async id => {
        ordemChamadas.push('exclusao')
        chai.assert.equal(id, carrinho._id)
      })

    await service.removeCarrinho(carrinho)

    sandbox.assert.calledOnceWithExactly(stubEstoque, carrinho.produtos)
    sandbox.assert.calledOnceWithExactly(stubExclusao, carrinho._id)
    chai.assert.deepEqual(ordemChamadas, ['estoque', 'exclusao'])
  })


it('removeCarrinho - Deve verificar as chamadas usando spy', async () => {
  const carrinho = {
    _id: 'carrinho-spy',
    produtos: [
      { idProduto: 'produto-1', quantidade: 1 }
    ]
  }

  const reabasteceSpy = sandbox.spy(service, 'reabasteceEstoque')
  const deleteStub = sandbox.stub(service, 'deleteById').resolves(1)
  const restoreStub = sandbox
    .stub(produtosService, 'restoreQuantidadePorLote')
    .resolves({})

  await service.removeCarrinho(carrinho)

  sandbox.assert.calledOnceWithExactly(
    reabasteceSpy,
    carrinho.produtos
  )

  sandbox.assert.calledOnceWithExactly(
    restoreStub,
    carrinho.produtos
  )

  sandbox.assert.calledOnceWithExactly(
    deleteStub,
    carrinho._id
  )
})


})
