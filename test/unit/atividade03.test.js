const sinon = require('sinon');
const assert = require('assert');

describe('Atividade 03 - Testes Unitários com Test Doubles no ServeRest', function () {
  afterEach(function () {
    sinon.restore();
  });

  // 1. Comportamento esperado
  it('deve validar o comportamento esperado de uma função com sucesso', function () {
    const calculadora = { somar: (a, b) => a + b };
    const resultado = calculadora.somar(2, 3);
    assert.strictEqual(resultado, 5);
  });

  // 2. Cenário alternativo
  it('deve tratar o cenário alternativo quando um parâmetro opcional é omitido', function () {
    function processarPerfil(nome, admin) {
      const tipo = admin !== undefined ? admin : false;
      return { nome, admin: tipo };
    }
    const usuario = processarPerfil('Heitor');
    assert.strictEqual(usuario.admin, false);
  });

  // 3. Cenário de erro
  it('deve lançar um erro em um cenário de dados inválidos', function () {
    function validarIdade(idade) {
      if (idade < 0) throw new Error('Idade inválida');
      return true;
    }
    assert.throws(() => { validarIdade(-5); }, /Idade inválida/);
  });

  // 4. Controle do retorno de uma dependência com stub
  it('deve controlar o retorno de uma dependência utilizando stub', function () {
    const repositorioExterno = { buscarPreco: () => 100 };
    sinon.stub(repositorioExterno, 'buscarPreco').returns(50);
    const preco = repositorioExterno.buscarPreco();
    assert.strictEqual(preco, 50);
  });

  // 5. Observação de chamadas ou argumentos com spy
  it('deve observar chamadas e argumentos utilizando spy', function () {
    const servicoDeLog = { gravar: (msg) => msg };
    const spyLog = sinon.spy(servicoDeLog, 'gravar');
    servicoDeLog.gravar('Teste de execução');
    assert(spyLog.calledOnce);
    assert(spyLog.calledWith('Teste de execução'));
  });

  // 6. Uso de mock quando a interação faz parte do comportamento esperado
  it('deve utilizar mock para validar expectativas de interação', function () {
    const servicoDeNotificacao = {
      enviarEmail: (email) => `Enviado para ${email}`
    };
    const mock = sinon.mock(servicoDeNotificacao);
    mock.expects('enviarEmail').once().withArgs('teste@email.com').returns('Sucesso');
    
    const resultado = servicoDeNotificacao.enviarEmail('teste@email.com');
    mock.verify();
    assert.strictEqual(resultado, 'Sucesso');
    mock.restore();
  });
});