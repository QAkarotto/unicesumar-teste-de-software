import { gerarEmailInexistente } from '../data/factories';
import { MENSAGENS } from '../data/mensagens';
import { expect, test } from '../fixtures/api.fixture';

const TOKEN_BEARER = /^Bearer [\w-]+\.[\w-]+\.[\w-]+$/;

test.describe('API ServeRest - Login', () => {
  test('deve autenticar com credenciais válidas e retornar token Bearer', async ({
    api,
    criarUsuario,
  }) => {
    const usuario = await criarUsuario();

    const response = await api.login({ email: usuario.email, password: usuario.password });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.message).toBe(MENSAGENS.loginRealizado);
    expect(body.authorization).toMatch(TOKEN_BEARER);
  });

  test('não deve autenticar com senha inválida', async ({ api, criarUsuario }) => {
    const usuario = await criarUsuario();

    const response = await api.login({ email: usuario.email, password: 'senha-incorreta' });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.message).toBe(MENSAGENS.loginInvalido);
    expect(body.authorization).toBeUndefined();
  });

  test('não deve autenticar com e-mail não cadastrado', async ({ api }) => {
    const response = await api.login({ email: gerarEmailInexistente(), password: 'qualquer' });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.message).toBe(MENSAGENS.loginInvalido);
    expect(body.authorization).toBeUndefined();
  });

  test('não deve autenticar com campos em branco', async ({ api }) => {
    const response = await api.login({ email: '', password: '' });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      email: 'email não pode ficar em branco',
      password: 'password não pode ficar em branco',
    });
  });
});
