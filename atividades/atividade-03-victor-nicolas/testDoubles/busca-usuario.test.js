const { expect } = require('chai')

const alterarValoresParaRegex = require(
  '../../../src/utils/alterarValoresParaRegex'
)

describe('Test Doubles - Busca de usuario', () => {
  it('Deve encontrar um nome independente de letras maiusculas', () => {
    // Arrange - preparar os dados
    const filtro = {
      nome: 'victor'
    }

    // Act - executar a funcao real
    const resultado = alterarValoresParaRegex(filtro)

    // Assert - verificar o comportamento
    expect(resultado.nome).to.be.instanceOf(RegExp)
    expect(resultado.nome.test('VICTOR')).to.equal(true)
    expect(resultado.nome.test('victor')).to.equal(true)
    expect(resultado.nome.test('Carlos')).to.equal(false)
  })
})
