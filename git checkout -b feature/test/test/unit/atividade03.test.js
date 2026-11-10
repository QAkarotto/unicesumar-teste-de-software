const sinon = require('sinon');
const { expect } = require('chai');

// ==========================================
// Módulos e Serviços do ServeRest (Simulados)
// ==========================================

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
  validarNomeDuplicado: async (nome) => {
    return false;
  },
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
  gerarToken: (payload) => {
    return jwt.sign(payload, 'secret_key');
  }
};

const transporter = {
  sendMail: (dados) => Promise.resolve(true)
};

const emailService = {
  enviarBoasVindas: async (email) => {
    return await transporter.sendMail({ to: email, subject: 'Bem-vindo ao ServeRest!' });
  }
};

// ==========================================
// Suíte de Testes Unitários - Atividade 03
// ==========================================

describe('Atividade 03 - Testes Unitários com Test Doubles no ServeRest', () => {

  // Limpa os dublês (stubs, spies e mocks) após cada teste para garantir independência
  afterEach(() => {
    sinon.restore();
  });

  // 1. Comportamento Esperado (Sem Test Doubles)
  it('1. Deve buscar um usuário por ID com sucesso (Cenário Esperado)', async () => {
    const usuario = await usuariosService.buscarPorId('1');
    expect(usuario).to.be.an('object');
    expect(usuario.nome).to.equal('Fulano');
    expect(usuario.email).to.equal('fulano@qa.com');
  });

  // 2. Cenário Alternativo (Com Stub)
  it('2. Deve retornar status 401 ao autenticar com email não cadastrado (Cenário Alternativo)', async () => {
    // Isolamos o loginService forçando o usuariosService a retornar null
    sinon.stub(usuariosService, 'buscarPorId').resolves(null);

    const resultado = await loginService.autenticar('inexistente@qa.com', '123456');
    expect(resultado.status).to.equal(401);
    expect(resultado.message).to.equal('Email e/ou senha inválidos');
  });

  // 3. Cenário de Erro (Com Stub)
  it('3. Deve lançar erro ao tentar cadastrar produto com nome duplicado (Cenário de Erro)', async () => {
    // Forçamos o método de validação a dizer que o produto é duplicado
    sinon.stub(produtosService, 'validarNomeDuplicado').resolves(true);

    try {
      await produtosService.cadastrar({ nome: 'Mouse Logitech', preco: 250 });
      expect.fail('Deveria ter lançado exceção por nome duplicado');
    } catch (error) {
      expect(error.message).to.equal('Já existe produto com esse nome');
    }
  });

  // 4. Controle do Retorno com Stub
  it('4. Deve controlar o retorno do serviço de usuário utilizando Stub', async () => {
    const usuarioFake = { id: '99', nome: 'QA Tester', email: 'stub@qa.com' };
    const stub = sinon.stub(usuariosService, 'buscarPorId').resolves(usuarioFake);

    const resultado = await usuariosService.buscarPorId('99');

    expect(stub.calledOnce).to.be.true;
    expect(resultado).to.deep.equal(usuarioFake);
  });

  // 5. Observação de Chamadas com Spy
  it('5. Deve observar se a função de assinatura JWT foi chamada com argumentos corretos usando Spy', () => {
    const spy = sinon.spy(jwt, 'sign');
    const payload = { id: 'usr_123', admin: 'true' };

    authUtils.gerarToken(payload);

    expect(spy.calledOnce).to.be.true;
    expect(spy.calledWith(payload, 'secret_key')).to.be.true;
  });

  // 6. Uso de Mock para Interação
  it('6. Deve verificar a interação obrigatória com o serviço de e-mail utilizando Mock', async () => {
    const mockTransporter = sinon.mock(transporter);

    // Define a expectativa: sendMail DEVE ser chamado 1 vez com este payload específico
    mockTransporter.expects('sendMail')
      .once()
      .withArgs({ to: 'aluno@unicesumar.edu.br', subject: 'Bem-vindo ao ServeRest!' })
      .resolves(true);

    await emailService.enviarBoasVindas('aluno@unicesumar.edu.br');

    // Valida se a expectativa configurada no mock foi cumprida
    mockTransporter.verify();
  });

});