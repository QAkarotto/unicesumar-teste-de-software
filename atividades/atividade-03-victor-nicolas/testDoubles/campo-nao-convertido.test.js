const { expect } = require('chai')

const alterarValoresParaRegex = require(
  '../../../src/utils/alterarValoresParaRegex'
)

describe('Teste 02 - Cenario alternativo', () => {
  it('Deve manter campo preco sem conversao', () => {
    // Arrange - preparar os dados
    const filtro = {
      preco: 100
    }

    // Act - executar a funcao real
    const resultado = alterarValoresParaRegex(filtro)

    // Assert - validar o resultado
    expect(resultado.preco).to.equal(100)
    expect(resultado.preco).to.not.be.instanceOf(RegExp)
  })
})
