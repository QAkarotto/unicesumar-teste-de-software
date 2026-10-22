import { gerarUsuario } from '../data/factories';
import { MENSAGENS } from '../data/mensagens';
import { expect, test } from '../fixtures/api.fixture';

const ID_SERVEREST = /^[A-Za-z0-9]{16}$/;

test.describe('API ServeRest - Usuários', () => {
  test('deve listar usuários com quantidade igual ao total retornado', async ({ api }) => {
    const response = await api.usuarios.listar();

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.usuarios)).toBe(true);
    // Regra: o campo "quantidade" deve refletir o total de usuários da lista
    expect(body.quantidade).toBe(body.usuarios.length);

    if (body.usuarios.length > 0) {
      expect(body.usuarios[0]).toEqual(
        expect.objectContaining({
          nome: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          administrador: expect.stringMatching(/^(true|false)$/),
          _id: expect.any(String),
        }),
      );
    }
  });

  test('deve cadastrar usuário com dados gerados dinamicamente e persistir os dados', async ({
    api,
    registrarLimpeza,
  }) => {
    const usuario = gerarUsuario();

    const response = await api.usuarios.cadastrar(usuario);
    const body = await response.json();
    registrarLimpeza((api) => api.usuarios.excluir(body._id));

    expect(response.status()).toBe(201);
    expect(body.message).toBe(MENSAGENS.cadastroRealizado);
    expect(body._id).toMatch(ID_SERVEREST);

    // Estado persistido: a consulta deve retornar exatamente os dados enviados
    const consulta = await api.usuarios.buscar(body._id);
    expect(consulta.status()).toBe(200);
    expect(await consulta.json()).toEqual({ ...usuario, _id: body._id });
  });

  test('não deve permitir cadastrar usuário com e-mail já utilizado', async ({
    api,
    criarUsuario,
  }) => {
    const existente = await criarUsuario();

    // Regra de negócio: o e-mail deve ser único
    const response = await api.usuarios.cadastrar(gerarUsuario({ email: existente.email }));

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.message).toBe(MENSAGENS.emailEmUso);
    expect(body._id).toBeUndefined();
  });

  test('não deve cadastrar usuário com e-mail e perfil inválidos', async ({ api }) => {
    const response = await api.usuarios.cadastrar({
      ...gerarUsuario(),
      email: 'email-invalido',
      administrador: 'talvez' as 'true',
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      email: 'email deve ser um email válido',
      administrador: "administrador deve ser 'true' ou 'false'",
    });
  });

  test('não deve cadastrar usuário sem os campos obrigatórios', async ({ api }) => {
    const response = await api.usuarios.cadastrar({});

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      nome: 'nome é obrigatório',
      email: 'email é obrigatório',
      password: 'password é obrigatório',
      administrador: 'administrador é obrigatório',
    });
  });

  test('deve atualizar os dados de um usuário', async ({ api, criarUsuario }) => {
    const usuario = await criarUsuario({ administrador: 'true' });
    const alteracao = gerarUsuario({ administrador: 'false' });

    const response = await api.usuarios.atualizar(usuario._id, alteracao);

    expect(response.status()).toBe(200);
    expect((await response.json()).message).toBe(MENSAGENS.registroAlterado);

    // Estado final: o mesmo ID deve refletir os novos dados
    const consulta = await api.usuarios.buscar(usuario._id);
    expect(await consulta.json()).toEqual({ ...alteracao, _id: usuario._id });
  });

  test('deve excluir um usuário e não encontrá-lo mais', async ({ api, criarUsuario }) => {
    const usuario = await criarUsuario();

    const response = await api.usuarios.excluir(usuario._id);

    expect(response.status()).toBe(200);
    expect((await response.json()).message).toBe(MENSAGENS.registroExcluido);

    const consulta = await api.usuarios.buscar(usuario._id);
    expect(consulta.status()).toBe(400);
    expect((await consulta.json()).message).toBe(MENSAGENS.usuarioNaoEncontrado);
  });
});
