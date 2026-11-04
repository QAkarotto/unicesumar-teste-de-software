'use strict'

const { expect } = require('chai')
const sandbox = require('sinon').createSandbox()

const serverest = require('./support/serverest')
const { fakeReq, fakeRes, corpoDaResposta } = require('./support/express')

// Unidade testada
const carrinhosController = serverest('controllers/carrinhos-controller')
// Dependência que será substituída
const carrinhosService = serverest('services/carrinhos-service')

describe('carrinhos-controller', () => {
  const headers = { authorization: 'Bearer header.payload.assinatura' }

  afterEach(() => sandbox.restore())

  describe('cancelarCompra', () => {
    it('CT12 - deve remover o carrinho do usuário e informar que o estoque foi reabastecido', async () => {
      const carrinho = { _id: 'qbMqntef4iTOwWfg', idUsuario: 'u1', produtos: [{ idProduto: 'p1', quantidade: 2 }] }
      // Mock: a interação com o serviço É o comportamento esperado — buscar o carrinho
      // pelo token e remover exatamente esse carrinho, uma única vez
      const mock = sandbox.mock(carrinhosService)
      mock.expects('getCarrinhoDoUsuario').once().withExactArgs(headers.authorization).resolves([carrinho])
      mock.expects('removeCarrinho').once().withExactArgs(carrinho).resolves()
      const res = fakeRes(sandbox)

      await carrinhosController.cancelarCompra(fakeReq({ headers }), res)

      mock.verify()
      sandbox.assert.calledOnceWithExactly(res.status, 200)
      expect(corpoDaResposta(res)).to.deep.equal({
        message: 'Registro excluído com sucesso. Estoque dos produtos reabastecido'
      })
    })

    it('CT13 - deve informar que não há carrinho e não remover nada quando o usuário não possui carrinho', async () => {
      const mock = sandbox.mock(carrinhosService)
      mock.expects('getCarrinhoDoUsuario').once().resolves([])
      mock.expects('removeCarrinho').never()
      const res = fakeRes(sandbox)

      await carrinhosController.cancelarCompra(fakeReq({ headers }), res)

      mock.verify()
      sandbox.assert.calledOnceWithExactly(res.status, 200)
      expect(corpoDaResposta(res)).to.deep.equal({ message: 'Não foi encontrado carrinho para esse usuário' })
    })
  })
})
