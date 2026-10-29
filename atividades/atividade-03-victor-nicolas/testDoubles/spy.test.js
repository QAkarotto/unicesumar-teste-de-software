const { expect } = require('chai')
const sinon = require('sinon')

const carrinhosService = require(
  '../../../src/services/carrinhos-service'
)

const produtosService = require(
  '../../../src/services/produtos-service'
)

describe('Teste 05 - Spy', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('Deve chamar reabastecimento com os produtos corretos', async () => {
    // Arrange - preparar os dados
    const carrinho = {
      _id: '123',
      produtos: [
        {
          idProduto: '456',
          quantidade: 2
        }
      ]
    }

    // Evitar alteracoes reais no banco
    sinon.stub(
      produtosService,
      'restoreQuantidadePorLote'
    ).resolves()

    sinon.stub(
      carrinhosService,
      'deleteById'
    ).resolves()

    // Criar o Spy
    const spy = sinon.spy(
      carrinhosService,
      'reabasteceEstoque'
    )

    // Act - executar a funcao real
    await carrinhosService.removeCarrinho(carrinho)

    // Assert - verificar as chamadas
    expect(spy.calledOnce).to.equal(true)

    expect(
      spy.calledWithExactly(carrinho.produtos)
    ).to.equal(true)
  })
})
