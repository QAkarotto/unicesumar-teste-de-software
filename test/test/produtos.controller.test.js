const { expect } = require('chai');
const sinon = require('sinon');
const ProdutosController = require('../controllers/Produtos.controller');
const ProdutoModel = require('../models/produto.model');

describe('ProdutosController', () => {
  let produtosController;

  beforeEach(() => {
    produtosController = new ProdutosController(ProdutoModel);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('1. deve cadastrar um produto com sucesso quando os dados forem válidos', async () => {
    const produtoMock = { nome: 'Mouse Gamer', preco: 150, quantidade: 10 };
 
    sinon.stub(ProdutoModel, 'findOne').resolves(null);
    sinon.stub(ProdutoModel, 'create').resolves({ _id: '123', ...produtoMock });

    const resultado = await produtosController.cadastrar(produtoMock);

    expect(resultado).to.have.property('_id', '123');
    expect(resultado.nome).to.equal('Mouse Gamer');
  });

  it('2. deve cadastrar produto aplicando valor padrão para descrição quando não informada', async () => {
    const produtoMock = { nome: 'Teclado Mecânico', preco: 200, quantidade: 5 };
 
    sinon.stub(ProdutoModel, 'findOne').resolves(null);
    sinon.stub(ProdutoModel, 'create').callsFake((dados) =>
      Promise.resolve({ _id: '124', ...dados, descricao: 'Sem descrição' })
    );

    const resultado = await produtosController.cadastrar(produtoMock);

    expect(resultado.descricao).to.equal('Sem descrição');
  });

  it('3. deve lançar erro ao tentar cadastrar produto com preço negativo', async () => {
    const produtoInvalido = { nome: 'Monitor', preco: -50, quantidade: 2 };

    let erro;
    try {
      await produtosController.cadastrar(produtoInvalido);
    } catch (err) {
      erro = err;
    }

    expect(erro).to.be.an('error');
    expect(erro.message).to.equal('O preço não pode ser negativo');
  });

  it('4. deve retornar erro informando duplicação quando findOne encontrar registro existente', async () => {
    const produtoExistente = { nome: 'Mouse Gamer', preco: 150, quantidade: 10 };
 
    sinon.stub(ProdutoModel, 'findOne').resolves({ _id: '999', ...produtoExistente });

    let erro;
    try {
      await produtosController.cadastrar(produtoExistente);
    } catch (err) {
      erro = err;
    }

    expect(erro).to.be.an('error');
    expect(erro.message).to.equal('Já existe produto com este nome');
  });

 
  it('5. deve consultar o model para verificar duplicidade usando exatamente o nome do produto informado', async () => {
    const produtoMock = { nome: 'Mousepad Gamer', preco: 60, quantidade: 15 };
    
    const findOneStub = sinon.stub(ProdutoModel, 'findOne').resolves(null);
    sinon.stub(ProdutoModel, 'create').resolves({ _id: '127', ...produtoMock });

    await produtosController.cadastrar(produtoMock);

    expect(findOneStub.calledOnce).to.be.true;
    
    expect(findOneStub.calledWith({ nome: 'Mousepad Gamer' })).to.be.true;
  });

  it('6. deve invocar o método create do model de produtos exatamente uma vez com o payload correto', async () => {
    const produtoMock = { nome: 'Webcam', preco: 250, quantidade: 8 };
 
    sinon.stub(ProdutoModel, 'findOne').resolves(null);
 
    const createStub = sinon.stub(ProdutoModel, 'create').resolves({ _id: '126', ...produtoMock });

    await produtosController.cadastrar(produtoMock);

    expect(createStub.calledOnceWith(sinon.match({
      nome: 'Webcam',
      preco: 250,
      quantidade: 8
    }))).to.be.true;
  });
});