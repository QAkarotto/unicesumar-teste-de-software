import { test, expect } from '../fixtures/api.fixture';
import { realizarLogin } from '../helpers/auth';
import { gerarUsuario } from '../data/factories';

test.describe('API ServeRest - Login', () => {
  test('autentica com dados válidos e retorna token Bearer', async ({ request, usuario }) => {
    const resp = await realizarLogin(request, usuario.usuario);

    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body.message).toBe('Login realizado com sucesso');
    expect(body.authorization).toMatch(/^Bearer .+/);
  });

  test('rejeita senha incorreta e não retorna token', async ({ request, usuario }) => {
    const resp = await realizarLogin(request, {
      email: usuario.usuario.email,
      password: `${usuario.usuario.password}-errada`,
    });

    expect(resp.status()).toBe(401);
    const body = await resp.json();
    expect(body.message).toBe('Email e/ou senha inválidos');
    expect(body.authorization).toBeUndefined();
  });

  test('rejeita e-mail não cadastrado', async ({ request }) => {
    const { email, password } = gerarUsuario();
    const resp = await realizarLogin(request, { email, password });

    expect(resp.status()).toBe(401);
    expect((await resp.json()).message).toBe('Email e/ou senha inválidos');
  });
});
