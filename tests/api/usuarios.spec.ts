import { test, expect } from '../fixtures/api.fixture';
import { gerarUsuario } from '../data/factories';
import {
  buscarUsuario,
  cadastrarUsuario,
  criarUsuarioOk,
  excluirUsuario,
} from '../helpers/api';

test.describe('API ServeRest - Usuários', () => {
  test('cadastra usuário com dados dinâmicos e persiste as informações', async ({ request }) => {
    const usuario = gerarUsuario();

    const resp = await cadastrarUsuario(request, usuario);
    const body = await resp.json();

    expect(resp.status()).toBe(201);
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body._id).toEqual(expect.any(String));

    try {
      const consulta = await buscarUsuario(request, body._id);
      expect(consulta.status()).toBe(200);
      expect(await consulta.json()).toMatchObject({
        nome: usuario.nome,
        email: usuario.email,
        administrador: usuario.administrador,
        _id: body._id,
      });
    } finally {
      await excluirUsuario(request, body._id);
    }
  });

  test('consulta usuário por ID e retorna os dados cadastrados', async ({ request, usuario }) => {
    const resp = await buscarUsuario(request, usuario.id);

    expect(resp.status()).toBe(200);
    expect(await resp.json()).toMatchObject({
      nome: usuario.usuario.nome,
      email: usuario.usuario.email,
      administrador: 'false',
      _id: usuario.id,
    });
  });

  test('regra de negócio: não permite cadastrar e-mail já utilizado', async ({
    request,
    usuario,
  }) => {
    const resp = await cadastrarUsuario(request, {
      ...gerarUsuario(),
      email: usuario.usuario.email,
    });
    const body = await resp.json();

    expect(resp.status()).toBe(400);
    expect(body.message).toBe('Este email já está sendo usado');
    expect(body._id).toBeUndefined();
  });

  test('cenário inválido: não cadastra usuário sem e-mail', async ({ request }) => {
    const { email, ...semEmail } = gerarUsuario();

    const resp = await request.post('/usuarios', { data: semEmail });

    expect(resp.status()).toBe(400);
    expect((await resp.json()).email).toBe('email é obrigatório');
  });

  test('cenário inválido: informa erro ao buscar usuário inexistente', async ({ request }) => {
    const resp = await buscarUsuario(request, 'idInexistente123');

    expect(resp.status()).toBe(400);
    expect((await resp.json()).message).toBe('Usuário não encontrado');
  });

  test('exclui usuário e confirma que ele deixou de existir', async ({ request }) => {
    const id = await criarUsuarioOk(request, gerarUsuario());

    const exclusao = await excluirUsuario(request, id);
    expect(exclusao.status()).toBe(200);
    expect((await exclusao.json()).message).toBe('Registro excluído com sucesso');

    const consulta = await buscarUsuario(request, id);
    expect(consulta.status()).toBe(400);
    expect((await consulta.json()).message).toBe('Usuário não encontrado');
  });
});
