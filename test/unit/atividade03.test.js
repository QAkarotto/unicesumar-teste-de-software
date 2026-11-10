const sinon = require('sinon');
const { expect } = require('chai');

// Módulos e Serviços Simulados
const usuariosService = {
  buscarPorId: async (id) => {
    if (id === '1') return { id: '1', nome: 'Fulano', email: 'fulano@qa.com' };
    return null;
  }
};

const loginService = {
  autenticar: async (email, senha) => {
    const usuario = await usuariosService.buscarPorId(email);
    if (!usuario) {
      return { status: 401, message: 'Email e/ou senha inválidos' };
    }
    return { status: 200, token: 'token-jwt-fake' };
  }
};

const produtosService = {
  validarNomeDuplicado: async (nome) => false,
  cadastrar: async (produto) => {
    const duplicado = await produtosService.validarNomeDuplicado(produto.nome);
    if (duplicado) {
      throw new Error('Já existe produto com esse nome');
    }
    return { id: 'prod123', ...produto };
  }
};

const jwt = {
  sign: (payload, secret) => 'token_gerado'
};

const authUtils = {
  gerarToken: (payload) => jwt.sign(payload, 'secret_key')
};

const transporter = {
  sendMail: (dados) => Promise.resolve(true)
};

const emailService = {
  enviarBoasVindas: async (email) => {
    return await transporter.sendMail({ to: email, subject: 'Bem-vindo ao ServeRest!' });
  }
};

describe('Atividade 03 - Testes Unitários com Test Doubles no ServeRest', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('1. Deve buscar um usuário por ID com sucesso (Cenário Esperado)', async () => {
    const usuario = await usuariosService.buscarPorId('1');
    expect(usuario).to.be.an('object');
    expect(usuario.nome).to.equal('Fulano');
  });

  it('2. Deve retornar status 401 ao autenticar com email não cadastrado (Cenário Alternativo)', async () => {
    sinon.stub(usuariosService, 'buscarPorId').resolves(null);
    const resultado = await loginService.autenticar('inexistente@qa.com', '123456');
    expect(resultado.status).to.equal(401);
  });

  it('3. Deve lançar erro ao tentar cadastrar produto com nome duplicado (Cenário de Erro)', async () => {
    sinon.stub(produtosService, 'validarNomeDuplicado').resolves(true);
    try {
      await produtosService.cadastrar({ nome: 'Mouse Logitech', preco: 250 });
      expect.fail('Deveria ter lançado exceção');
    } catch (error) {
      expect(error.message).to.equal('Já existe produto com esse nome');
    }
  });

  it('4. Deve controlar o retorno do serviço de usuário utilizando Stub', async () => {
    const usuarioFake = { id: '99', nome: 'QA Tester', email: 'stub@qa.com' };
    const stub = sinon.stub(usuariosService, 'buscarPorId').resolves(usuarioFake);
    const resultado = await usuariosService.buscarPorId('99');
    expect(stub.calledOnce).to.be.true;
    expect(resultado).to.deep.equal(usuarioFake);
  });

  it('5. Deve observar se a função de assinatura JWT foi chamada com argumentos corretos usando Spy', () => {
    const spy = sinon.spy(jwt, 'sign');
    const payload = { id: 'usr_123' };
    authUtils.gerarToken(payload);
    expect(spy.calledOnce).to.be.true;
    expect(spy.calledWith(payload, 'secret_key')).to.be.true;
  });

  it('6. Deve verificar a interação obrigatória com o serviço de e-mail utilizando Mock', async () => {
    const mockTransporter = sinon.mock(transporter);
    mockTransporter.expects('sendMail')
      .once()
      .withArgs({ to: 'aluno@unicesumar.edu.br', subject: 'Bem-vindo ao ServeRest!' })
      .resolves(true);

    await emailService.enviarBoasVindas('aluno@unicesumar.edu.br');
    mockTransporter.verify();
  });
});