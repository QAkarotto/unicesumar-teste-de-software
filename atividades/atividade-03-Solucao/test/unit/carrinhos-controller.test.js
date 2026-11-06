'use strict'

const { expect } = require('chai')
const sinon = require('sinon')

const controller = require('../../src/controllers/carrinhos-controller')
const service = require('../../src/services/carrinhos-service')
const constant = require('../../src/utils/constants')

const criarResFake = () => {
  const res = {
    statusCode: null,
    body: null,
    status (code) { this.statusCode = code; return this },
    send (payload) { this.body = payload; return this },
    json (payload) { this.body = payload; return this }
  }
  return res
}

describe('Carrinhos Controller', () => {
  let sandbox
  let res

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    res = criarResFake()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('get', () => {
    it('deve retornar status 200 com a lista de carrinhos e a quantidade', async () => {
      const carrinhos = [{ _id: 'c1' }, { _id: 'c2' }]
      const getAllStub = sandbox.stub(service, 'getAll').resolves(carrinhos)
      const req = { query: { precoTotal: 100 } }

      await controller.get(req, res)

      expect(getAllStub.calledOnceWith(req.query)).to.be.true()
      expect(res.body).to.deep.equal({ quantidade: 2, carrinhos })
    })
  })

  describe('getOne', () => {
    it('deve retornar status 400 quando o carrinho não existir', async () => {
      sandbox.stub(service, 'getOne').resolves(null)
      const req = { params: { id: 'inexistente' } }

      await controller.getOne(req, res)

      expect(res.statusCode).to.equal(400)
      expect(res.body).to.deep.equal({ message: constant.CART_NOT_FOUND })
    })

    it('deve retornar status 200 com o carrinho quando encontrado', async () => {
      const carrinho = { _id: 'c1', precoTotal: 50 }
      sandbox.stub(service, 'getOne').resolves(carrinho)
      const req = { params: { id: 'c1' } }

      await controller.getOne(req, res)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.deep.equal(carrinho)
    })
  })

  describe('post - cenários de erro', () => {
    it('deve retornar status 400 quando o usuário já possuir carrinho', async () => {
      sandbox.stub(service, 'usuarioJaPossuiCarrinho').resolves({
        idUsuario: 'u1',
        possuiCarrinho: true
      })
      const req = { headers: { authorization: 'Bearer x' }, body: { produtos: [] } }

      await controller.post(req, res)

      expect(res.statusCode).to.equal(400)
      expect(res.body).to.deep.equal({ message: constant.LIMIT_JUST_ONE_CART })
    })

    it('deve retornar o status 400 quando houver produtos duplicados', async () => {
      sandbox.stub(service, 'usuarioJaPossuiCarrinho').resolves({
        idUsuario: 'u1',
        possuiCarrinho: false
      })

      sandbox.stub(service, 'extrairProdutosDuplicados').returns(['p1'])
      const req = {
        headers: { authorization: 'Bearer x' },
        body: { produtos: [{ idProduto: 'p1', quantidade: 1 }, { idProduto: 'p1', quantidade: 2 }] }
      }

      await controller.post(req, res)

      expect(res.statusCode).to.equal(400)
      expect(res.body).to.deep.equal({
        message: constant.CART_WITH_DUPLICATE_PRODUCT,
        idProdutosDuplicados: ['p1']
      })
    })

    it('deve retornar erro de service quando produto não existir (getProdutosComPrecoUnitarioOuErro)', async () => {
      sandbox.stub(service, 'usuarioJaPossuiCarrinho').resolves({
        idUsuario: 'u1',
        possuiCarrinho: false
      })
      sandbox.stub(service, 'extrairProdutosDuplicados').returns([])
      sandbox.stub(service, 'getProdutosComPrecoUnitarioOuErro').resolves({
        error: { statusCode: 400, message: constant.PRODUCT_NOT_FOUND, item: { idProduto: 'x' } }
      })

      const req = {
        headers: { authorization: 'Bearer x' },
        body: { produtos: [{ idProduto: 'x', quantidade: 1 }] }
      }

      await controller.post(req, res)

      expect(res.statusCode).to.equal(400)
      expect(res.body).to.deep.equal({
        message: constant.PRODUCT_NOT_FOUND,
        item: { idProduto: 'x' }
      })
    })
  })

  describe('post - fluxo de sucesso', () => {
    it('deve chamar criarCarrinho com precoTotal e quantidadeTotal calculados', async () => {
      const produtosComPreco = [
        { idProduto: 'p1', quantidade: 2, precoUnitario: 10 },
        { idProduto: 'p2', quantidade: 3, precoUnitario: 5 }
      ]

      sandbox.stub(service, 'usuarioJaPossuiCarrinho').resolves({
        idUsuario: 'u1',
        possuiCarrinho: false
      })
      sandbox.stub(service, 'extrairProdutosDuplicados').returns([])
      sandbox.stub(service, 'getProdutosComPrecoUnitarioOuErro').resolves({ produtosComPrecoUnitario: produtosComPreco })
      sandbox.stub(service, 'precoTotal').resolves(35)
      sandbox.stub(service, 'quantidadeTotal').resolves(5)

      const criarCarrinhoSpy = sandbox.stub(service, 'criarCarrinho').resolves({ _id: 'novo-id' })

      const req = {
        headers: { authorization: 'Bearer x' },
        body: { produtos: [{ idProduto: 'p1', quantidade: 2 }, { idProduto: 'p2', quantidade: 3 }] }
      }

      await controller.post(req, res)

      expect(criarCarrinhoSpy.calledOnce).to.be.true()
      expect(criarCarrinhoSpy.firstCall.args[0]).to.deep.equal({
        produtos: produtosComPreco,
        precoTotal: 35,
        quantidadeTotal: 5,
        idUsuario: 'u1'
      })

      expect(res.statusCode).to.equal(201)
      expect(res.body).to.deep.equal({ message: constant.POST_SUCCESS, _id: 'novo-id' })
    })
  })

  describe('cancelarCompra', () => {
    it('deve remover o carrinho exatamente uma vez e reabastecer o estoque', async () => {
      const carrinho = { _id: 'c1', produtos: [{ idProduto: 'p1', quantidade: 1 }] }
      sandbox.stub(service, 'getCarrinhoDoUsuario').resolves([carrinho])

      const mockService = sandbox.mock(service)
      mockService.expects('removeCarrinho').once().withArgs(carrinho).resolves()

      const req = { headers: { authorization: 'Bearer x' } }

      await controller.cancelarCompra(req, res)

      mockService.verify()
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.deep.equal({
        message: `${constant.DELETE_SUCCESS}. ${constant.REPLENISHED_STOCK}`
      })
    })

    it('deve retornar status 200 com NO_CART quando o usuário não tiver carrinho', async () => {
      sandbox.stub(service, 'getCarrinhoDoUsuario').resolves([])
      const req = { headers: { authorization: 'Bearer x' } }

      await controller.cancelarCompra(req, res)

      expect(res.statusCode).to.equal(200)
      expect(res.body).to.deep.equal({ message: constant.NO_CART })
    })
  })

  describe('concluirCompra', () => {
    it('deve concluir a compra chamando concluiCompra uma única vez', async () => {
      const carrinho = { _id: 'c1' }
      sandbox.stub(service, 'getCarrinhoDoUsuario').resolves([carrinho])

      const mockService = sandbox.mock(service)
      mockService.expects('concluiCompra').once().withArgs(carrinho).resolves()

      const req = { headers: { authorization: 'Bearer x' } }

      await controller.concluirCompra(req, res)

      mockService.verify()
      expect(res.statusCode).to.equal(200)
      expect(res.body).to.deep.equal({ message: constant.DELETE_SUCCESS })
    })
  })
})
