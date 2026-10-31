'use strict'

const { expect } = require('chai')
const sinon = require('sinon')

const produtosController = require('../../src/controllers/produtos-controller')
const produtosService = require('../../src/services/produtos-service')
const carrinhosService = require('../../src/services/carrinhos-service')
const constant = require('../../src/utils/constants')

function criarResponseMock () {
  const res = {}
  res.status = sinon.stub().returns(res)
  res.send = sinon.stub().returns(res)
  res.json = sinon.stub().returns(res)
  return res
}

describe('Testes unitários do controller de produtos', function () {
    afterEach(function () {
        sinon.restore()
    })

    it('1. deve listar produtos e informar a quantidade retornada', async function () {
        const produtos = [
        { _id: 'produto00000001', nome: 'Teclado', preco: 120, quantidade: 5 },
        { _id: 'produto00000002', nome: 'Mouse', preco: 80, quantidade: 8 }
        ]
        const getAllStub = sinon.stub(produtosService, 'getAll').resolves(produtos)
        const req = { query: { nome: 'o' } }
        const res = criarResponseMock()

        await produtosController.get(req, res)

        expect(getAllStub.calledOnceWithExactly(req.query)).to.equal(true)
        expect(res.status.calledOnceWithExactly(200)).to.equal(true)
        expect(res.send.calledOnceWithExactly({ quantidade: 2, produtos })).to.equal(true)
    })

    it('2. deve retornar um produto quando o ID existe', async function () {
        const produto = { _id: 'produto00000001', nome: 'Teclado', preco: 120, quantidade: 5 }
        const getOneStub = sinon.stub(produtosService, 'getOne').resolves(produto)
        const req = { params: { id: produto._id } }
        const res = criarResponseMock()

        await produtosController.getOne(req, res)

        expect(getOneStub.calledOnceWithExactly(produto._id)).to.equal(true)
        expect(res.status.calledOnceWithExactly(200)).to.equal(true)
        expect(res.send.calledOnceWithExactly(produto)).to.equal(true)
    })

    it('3. deve retornar erro quando o produto consultado não existe', async function () {
        sinon.stub(produtosService, 'getOne').resolves(null)
        const req = { params: { id: 'idInexistente123' } }
        const res = criarResponseMock()

        await produtosController.getOne(req, res)

        expect(res.status.calledOnceWithExactly(400)).to.equal(true)
        expect(res.json.calledOnceWithExactly({ message: constant.PRODUCT_NOT_FOUND })).to.equal(true)
        expect(res.send.called).to.equal(false)
    })

    it('4. deve cadastrar produto e devolver o ID criado', async function () {
        const body = { nome: '  Teclado Mecânico  ', preco: 250, descricao: 'Teclado', quantidade: 10 }
        sinon.stub(produtosService, 'existeProduto').resolves(null)
        const criarProdutoStub = sinon.stub(produtosService, 'criarProduto').resolves({ _id: 'produto00000001' })
        const req = { body }
        const res = criarResponseMock()

        await produtosController.post(req, res)

        expect(criarProdutoStub.calledOnceWithExactly(body)).to.equal(true)
        expect(res.status.calledOnceWithExactly(201)).to.equal(true)
        expect(res.send.calledOnceWithExactly({ message: constant.POST_SUCCESS, _id: 'produto00000001' })).to.equal(true)
    })

    it('5. não deve cadastrar produto com nome já utilizado', async function () {
        sinon.stub(produtosService, 'existeProduto').resolves({ _id: 'produtoExistente01', nome: 'Teclado' })
        const criarProdutoStub = sinon.stub(produtosService, 'criarProduto')
        const req = { body: { nome: '  Teclado  ', preco: 100, descricao: 'Descrição', quantidade: 3 } }
        const res = criarResponseMock()

        await produtosController.post(req, res)

        expect(res.status.calledOnceWithExactly(400)).to.equal(true)
        expect(res.send.calledOnceWithExactly({ message: constant.NAME_ALREADY_USED })).to.equal(true)
        expect(criarProdutoStub.called).to.equal(false)
    })

    it('6. deve consultar a existência pelo nome sem espaços nas extremidades', async function () {
        const existeProdutoStub = sinon.stub(produtosService, 'existeProduto').resolves(null)
        sinon.stub(produtosService, 'criarProduto').resolves({ _id: 'produto00000001' })
        const req = { body: { nome: '  Fone Bluetooth  ', preco: 99, descricao: 'Fone', quantidade: 4 } }
        const res = criarResponseMock()

        await produtosController.post(req, res)

        expect(existeProdutoStub.calledOnce).to.equal(true)
        expect(existeProdutoStub.firstCall.args[0]).to.deep.equal({ nome: 'Fone Bluetooth' })
    })

    it('7. deve impedir a exclusão quando o produto pertence a um carrinho', async function () {
        const carrinho = { _id: 'carrinho0000001' }
        const existeNoCarrinhoStub = sinon.stub(carrinhosService, 'existeCarrinhoComProduto').resolves(carrinho)
        const deleteStub = sinon.stub(produtosService, 'deleteById')
        const req = { params: { id: 'produto00000001' } }
        const res = criarResponseMock()

        await produtosController.delete(req, res)

        expect(existeNoCarrinhoStub.calledOnceWithExactly(req.params.id)).to.equal(true)
        expect(res.status.calledOnceWithExactly(400)).to.equal(true)
        expect(res.send.calledOnceWithExactly({ message: constant.DELETE_PRODUCT_WITH_CART, idCarrinhos: [carrinho._id] })).to.equal(true)
        expect(deleteStub.called).to.equal(false)
    })

    it('8. deve excluir produto quando ele não está em carrinho', async function () {
        sinon.stub(carrinhosService, 'existeCarrinhoComProduto').resolves(null)
        const deleteMock = sinon.mock(produtosService)
        deleteMock.expects('deleteById').once().withExactArgs('produto00000001').returns(Promise.resolve(1))
        const req = { params: { id: 'produto00000001' } }
        const res = criarResponseMock()
    
        await produtosController.delete(req, res)
    
        deleteMock.verify()
        expect(res.status.calledOnceWithExactly(200)).to.equal(true)
        expect(res.send.calledOnceWithExactly({ message: constant.DELETE_SUCCESS })).to.equal(true)
    })

    it('9. deve informar que nenhum produto foi excluído quando o ID não existe', async function () {
        sinon.stub(carrinhosService, 'existeCarrinhoComProduto').resolves(null)
        sinon.stub(produtosService, 'deleteById').resolves(0)
        const req = { params: { id: 'idInexistente123' } }
        const res = criarResponseMock()
    
        await produtosController.delete(req, res)
    
        expect(res.status.calledOnceWithExactly(200)).to.equal(true)
        expect(res.send.calledOnceWithExactly({ message: constant.DELETE_NONE })).to.equal(true)
    })

    it('10. deve atualizar produto existente com sucesso', async function () {
        sinon.stub(produtosService, 'existeProduto').resolves(null)
        const updateStub = sinon.stub(produtosService, 'createOrUpdateById').resolves({ _id: 'produto00000001' })
        const req = {
        params: { id: 'produto00000001' },
        body: { nome: '  Teclado novo  ', preco: 300, descricao: 'Atualizado', quantidade: 12 }
        }
        const res = criarResponseMock()
    
        await produtosController.put(req, res)
    
        expect(updateStub.calledOnceWithExactly(req.params.id, req.body)).to.equal(true)
        expect(res.status.calledOnceWithExactly(200)).to.equal(true)
        expect(res.json.calledOnceWithExactly({ message: constant.PUT_SUCCESS })).to.equal(true)
    })

    it('11. não deve atualizar produto para um nome já utilizado por outro produto', async function () {
        sinon.stub(produtosService, 'existeProduto').resolves({ _id: 'outroProduto0001', nome: 'Mouse' })
        const updateStub = sinon.stub(produtosService, 'createOrUpdateById')
        const req = {
          params: { id: 'produto00000001' },
          body: { nome: ' Mouse ', preco: 80, descricao: 'Mouse', quantidade: 5 }
        }
        const res = criarResponseMock()
    
        await produtosController.put(req, res)
    
        expect(res.status.calledOnceWithExactly(400)).to.equal(true)
        expect(res.json.calledOnceWithExactly({ message: constant.NAME_ALREADY_USED })).to.equal(true)
        expect(updateStub.called).to.equal(false)
    })

    it('12. deve cadastrar um novo produto quando o ID enviado ainda não existe', async function () {
        sinon.stub(produtosService, 'existeProduto').resolves(null)
        const novoProduto = { _id: 'novoProduto00001' }
        sinon.stub(produtosService, 'createOrUpdateById').resolves(novoProduto)
        const req = {
          params: { id: 'produtoNaoExiste01' },
          body: { nome: '  Monitor  ', preco: 700, descricao: 'Monitor', quantidade: 2 }
        }
        const res = criarResponseMock()
    
        await produtosController.put(req, res)
    
        expect(res.status.calledOnceWithExactly(201)).to.equal(true)
        expect(res.json.calledOnceWithExactly({ message: constant.POST_SUCCESS, _id: novoProduto._id })).to.equal(true)
    })
})
