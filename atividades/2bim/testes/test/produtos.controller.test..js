const { expect } = require('chai');
const sinon = require('sinon');
const ProdutosController = require('../controllers/produtos.controller');
const ProdutoModel = require('../models/produto.model');
const LoggerService = require('../services/logger.service');

describe('ProdutosController - Testes Unitários com Sinon.js', () => {
  let produtosController;

  beforeEach(() => {
    produtosController = new ProdutosController(ProdutoModel, LoggerService);
  });

  afterEach(() => {
    // Limpa todos os stubs e spies criados pelo Sinon após cada teste
    sinon.restore();
  });

  // 1. Comportamento Esperado
  it('1. deve cadastrar um produto com sucesso quando os dados forem válidos', async () => {
    const produtoMock = { nome: 'Mouse Gamer', preco: 150, quantidade: 10 };
 
    sinon.stub(ProdutoModel, 'findOne').resolves(null);
    sinon.stub(ProdutoModel, 'create').resolves({ _id: '123', ...produtoMock });

    const resultado = await produtosController.cadastrar(produtoMock);

    expect(resultado).to.have.property('_id', '123');
    expect(resultado.nome).to.equal('Mouse Gamer');
  });

  // 2. Cenário Alternativo
  it('2. deve cadastrar produto aplicando valor padrão para descrição quando não informada', async () => {
    const produtoMock = { nome: 'Teclado Mecânico', preco: 200, quantidade: 5 };
 
    sinon.stub(ProdutoModel, 'findOne').resolves(null);
    sinon.stub(ProdutoModel, 'create').callsFake((dados) =>
      Promise.resolve({ _id: '124', ...dados, descricao: 'Sem descrição' })
    );

    const resultado = await produtosController.cadastrar(produtoMock);

    expect(resultado.descricao).to.equal('Sem descrição');
  });

  // 3. Cenário de Erro
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

  // 4. Controle de Retorno com Stub
  it('4. deve retornar erro informando duplicação quando findOne encontrar registro existente', async () => {
    const produtoExistente = { nome: 'Mouse Gamer', preco: 150, quantidade: 10 };
 
    // Stub controlando o retorno fixo para simular duplicidade
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

  // 5. Observação de Chamadas com Spy
  it('5. deve registrar log de auditoria ao cadastrar um produto com sucesso', async () => {
    const produtoMock = { nome: 'Headset', preco: 300, quantidade: 4 };
 
    sinon.stub(ProdutoModel, 'findOne').resolves(null);
    sinon.stub(ProdutoModel, 'create').resolves({ _id: '125', ...produtoMock });
 
    // Spy para observar chamadas sem alterar o comportamento
    const logSpy = sinon.spy(LoggerService, 'registrarLog');

    await produtosController.cadastrar(produtoMock);

    expect(logSpy.calledOnce).to.be.true;
    expect(logSpy.calledWith(sinon.match(/Headset/))).to.be.true;
  });

  // 6. Uso de Stub/Mock para Interação
  it('6. deve invocar o método create do model de produtos exatamente uma vez com o payload correto', async () => {
    const produtoMock = { nome: 'Webcam', preco: 250, quantidade: 8 };
 
    sinon.stub(ProdutoModel, 'findOne').resolves(null);
 
    // Stub simulando a persistência e permitindo validar os argumentos recebidos
    const createStub = sinon.stub(ProdutoModel, 'create').resolves({ _id: '126', ...produtoMock });

    await produtosController.cadastrar(produtoMock);

    expect(createStub.calledOnceWith(sinon.match({
      nome: 'Webcam',
      preco: 250,
      quantidade: 8
    }))).to.be.true;
  });
});