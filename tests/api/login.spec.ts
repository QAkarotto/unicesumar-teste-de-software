import { expect, test } from '@playwright/test';
import { Usuario, cadastrarUsuario, excluirUsuario, gerarUsuario } from './helpers';

test.describe('API ServeRest - Login', () => {
  let usuario: Usuario;
  let idUsuario: string;

  test.beforeAll(async ({ request }) => {
    usuario = gerarUsuario();
    idUsuario = await cadastrarUsuario(request, usuario);
  });

  test.afterAll(async ({ request }) => {
    await excluirUsuario(request, idUsuario);
  });

  test('deve realizar login com credenciais válidas e retornar token', async ({ request }) => {
    const response = await request.post('/login', {
      data: { email: usuario.email, password: usuario.password },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.message).toBe('Login realizado com sucesso');
    expect(body.authorization).toMatch(/^Bearer\s.+/);
  });

  test('não deve realizar login com senha inválida', async ({ request }) => {
    const response = await request.post('/login', {
      data: { email: usuario.email, password: 'senha-incorreta' },
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.message).toBe('Email e/ou senha inválidos');
    expect(body.authorization).toBeUndefined();
  });
});
