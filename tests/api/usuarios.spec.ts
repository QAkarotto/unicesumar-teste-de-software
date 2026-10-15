import { expect, test } from '@playwright/test';
import { cadastrarUsuario, excluirUsuario, gerarUsuario } from './helpers';

test.describe('API ServeRest - Usuários', () => {
  const idsCriados: string[] = [];

  test.afterAll(async ({ request }) => {
    for (const id of idsCriados) {
      await excluirUsuario(request, id);
    }
  });

  test('deve listar usuários com quantidade igual ao total retornado', async ({ request }) => {
    const response = await request.get('/usuarios');

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

  test('deve cadastrar um novo usuário com sucesso', async ({ request }) => {
    const usuario = gerarUsuario();

    const response = await request.post('/usuarios', { data: usuario });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body._id).toEqual(expect.any(String));
    expect(body._id).not.toBe('');

    idsCriados.push(body._id);
  });

  test('não deve permitir cadastrar usuário com e-mail já utilizado', async ({ request }) => {
    const usuario = gerarUsuario();
    idsCriados.push(await cadastrarUsuario(request, usuario));

    // Regra de negócio: o e-mail deve ser único
    const response = await request.post('/usuarios', {
      data: { ...gerarUsuario(), email: usuario.email },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.message).toBe('Este email já está sendo usado');
    expect(body._id).toBeUndefined();
  });

  test('deve buscar usuário por ID com os dados cadastrados', async ({ request }) => {
    const usuario = gerarUsuario(true);
    const id = await cadastrarUsuario(request, usuario);
    idsCriados.push(id);

    const response = await request.get(`/usuarios/${id}`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ ...usuario, _id: id });
  });
});
