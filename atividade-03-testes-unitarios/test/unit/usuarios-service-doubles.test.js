
const { expect } = require('chai')
const sinon = require('sinon')
const Datastore = require('nedb-promises')

const caminhoServico = require.resolve('../../src/services/usuarios-service')

describe('usuarios-service - Test Doubles', () => {
  let usuariosService
  let datastore

  beforeEach(() => {
    datastore = {
      ensureIndex () {},
      find () { return Promise.resolve([]) },
      findOne () {},
      insert () {},
      remove () {},
      update () {}
    }

    sinon.stub(Datastore, 'create').returns(datastore)

    delete require.cache[caminhoServico]
    usuariosService = require(caminhoServico)
  })

  afterEach(() => {
    sinon.restore()
    delete require.cache[caminhoServico]
  })

  it('deve listar usuarios conforme a consulta', async () => {
    const spy = sinon.spy(datastore, 'find')

    const resultado = await usuariosService.getAll({ nome: 'Teste' })

    expect(resultado).to.deep.equal([])
    expect(spy.calledOnce).to.equal(true)
    expect(spy.firstCall.args[0].nome).to.be.instanceOf(RegExp)
  })

  it('deve buscar usuario pelo ID', async () => {
    const usuario = { _id: '123', nome: 'Severo' }
    sinon.stub(datastore, 'findOne').resolves(usuario)

    const resultado = await usuariosService.getOne('123')

    expect(resultado).to.deep.equal(usuario)
    expect(datastore.findOne.calledOnceWithExactly({ _id: '123' })).to.equal(true)
  })

  it('deve retornar null quando o usuario nao existir', async () => {
    sinon.stub(datastore, 'findOne').resolves(null)

    const resultado = await usuariosService.getOne('999')

    expect(resultado).to.equal(null)
  })

  it('deve identificar um usuario administrador', async () => {
    sinon.stub(datastore, 'findOne').resolves({
      administrador: 'true'
    })

    const resultado = await usuariosService.usuarioEhAdministrador({
      email: 'admin@teste.com',
      password: '123456'
    })

    expect(resultado).to.equal(true)
  })

  it('deve cadastrar usuario usando o datastore', async () => {
    const usuario = { nome: 'Aluno Teste', email: 'aluno@teste.com' }

    const mock = sinon.mock(datastore)
    mock.expects('insert').once().withExactArgs(usuario).resolves({
      ...usuario,
      _id: '123'
    })

    const resultado = await usuariosService.createUser(usuario)

    expect(resultado._id).to.equal('123')
    mock.verify()
    mock.restore()
  })

  it('deve propagar erro ao cadastrar usuario', async () => {
    sinon.stub(datastore, 'insert').rejects(new Error('Erro no cadastro'))

    try {
      await usuariosService.createUser({ nome: 'Teste' })
      throw new Error('Era esperado um erro no cadastro')
    } catch (erro) {
      expect(erro.message).to.equal('Erro no cadastro')
    }
  })

  it('deve excluir usuario pelo ID', async () => {
    const stub = sinon.stub(datastore, 'remove').resolves(1)

    const resultado = await usuariosService.deleteById('123')

    expect(resultado).to.equal(1)
    expect(stub.calledOnceWithExactly({ _id: '123' }, {})).to.equal(true)
  })

  it('deve atualizar os dados do usuario', async () => {
    const dados = { nome: 'Nome Atualizado' }
    const stub = sinon.stub(datastore, 'update').resolves(dados)

    const resultado = await usuariosService.createOrUpdateById('123', dados)

    expect(resultado).to.deep.equal(dados)
    expect(stub.calledOnceWithExactly(
      { _id: '123' },
      dados,
      { upsert: true, returnUpdatedDocs: true }
    )).to.equal(true)
  })
})
