'use strict'

const { expect } = require('chai')
const sandbox = require('sinon').createSandbox()

const serverest = require('./support/serverest')
const { fakeReq, fakeRes, corpoDaResposta } = require('./support/express')

// Unidade testada
const produtosController = serverest('controllers/produtos-controller')
// Dependências que serão substituídas
const produtosService = serverest('services/produtos-service')
const carrinhosService = serverest('services/carrinhos-service')

describe('produtos-controller', () => {
  afterEach(() => sandbox.restore())

  describe('delete', () => {
    it('CT07 - deve excluir o produto pelo id quando ele não está em nenhum carrinho', async () => {
      sandbox.stub(carrinhosService, 'existeCarrinhoComProduto').resolves(null)
      // Mock: a exclusão faz parte do comportamento esperado,
      // então a expectativa define quantas vezes e com qual argumento ela deve ocorrer
      const mock = sandbox.mock(produtosService)
      mock.expects('deleteById').once().withExactArgs('BeeJh5lz3k6kSIzA').resolves(1)
      const res = fakeRes(sandbox)

      await produtosController.delete(fakeReq({ params: { id: 'BeeJh5lz3k6kSIzA' } }), res)

      mock.verify()
      sandbox.assert.calledOnceWithExactly(res.status, 200)
      expect(corpoDaResposta(res)).to.deep.equal({ message: 'Registro excluído com sucesso' })
    })

    it('CT08 - não deve excluir o produto que faz parte de um carrinho', async () => {
      sandbox.stub(carrinhosService, 'existeCarrinhoComProduto').resolves({ _id: 'qbMqntef4iTOwWfg' })
      // Mock: a regra de negócio exige que a exclusão NUNCA seja chamada
      const mock = sandbox.mock(produtosService)
      mock.expects('deleteById').never()
      const res = fakeRes(sandbox)

      await produtosController.delete(fakeReq({ params: { id: 'BeeJh5lz3k6kSIzA' } }), res)

      mock.verify()
      sandbox.assert.calledOnceWithExactly(res.status, 400)
      expect(corpoDaResposta(res)).to.deep.equal({
        message: 'Não é permitido excluir produto que faz parte de carrinho',
        idCarrinhos: ['qbMqntef4iTOwWfg']
      })
    })

    it('CT09 - deve informar que nenhum registro foi excluído quando o id não existe', async () => {
      sandbox.stub(carrinhosService, 'existeCarrinhoComProduto').resolves(null)
      sandbox.stub(produtosService, 'deleteById').resolves(0)
      const res = fakeRes(sandbox)

      await produtosController.delete(fakeReq({ params: { id: 'IdInexistente123' } }), res)

      sandbox.assert.calledOnceWithExactly(res.status, 200)
      expect(corpoDaResposta(res)).to.deep.equal({ message: 'Nenhum registro excluído' })
    })
  })

  describe('post', () => {
    it('CT10 - deve verificar duplicidade usando o nome sem espaços nas pontas e cadastrar o produto', async () => {
      const existeProduto = sandbox.stub(produtosService, 'existeProduto').resolves(null)
      const criarProduto = sandbox.stub(produtosService, 'criarProduto').resolves({ _id: 'NovoProduto00001' })
      const body = { nome: '   Mouse Gamer   ', preco: 150, descricao: 'Mouse', quantidade: 10 }
      const res = fakeRes(sandbox)

      await produtosController.post(fakeReq({ body }), res)

      // Spy (via stub) nos argumentos: a busca por duplicidade usa o nome "aparado"
      sandbox.assert.calledOnceWithExactly(existeProduto, { nome: 'Mouse Gamer' })
      sandbox.assert.calledOnceWithExactly(criarProduto, body)
      sandbox.assert.callOrder(existeProduto, criarProduto)
      sandbox.assert.calledOnceWithExactly(res.status, 201)
      expect(corpoDaResposta(res)).to.deep.equal({ message: 'Cadastro realizado com sucesso', _id: 'NovoProduto00001' })
    })

    it('CT11 - não deve cadastrar produto com nome já existente, mesmo com espaços extras', async () => {
      sandbox.stub(produtosService, 'existeProduto').resolves({ _id: 'BeeJh5lz3k6kSIzA', nome: 'Mouse Gamer' })
      const criarProduto = sandbox.spy(produtosService, 'criarProduto')
      const res = fakeRes(sandbox)

      await produtosController.post(fakeReq({ body: { nome: ' Mouse Gamer ', preco: 1, descricao: 'x', quantidade: 1 } }), res)

      sandbox.assert.calledOnceWithExactly(res.status, 400)
      expect(corpoDaResposta(res)).to.deep.equal({ message: 'Já existe produto com esse nome' })
      sandbox.assert.notCalled(criarProduto)
    })
  })
})
