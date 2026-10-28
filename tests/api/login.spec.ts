import { test, expect } from '../fixtures/api.fixture';
import { usuarioFactory } from '../data/factories';
import { autenticar } from '../helpers/auth';

test('autentica usuário cadastrado e retorna token Bearer', async ({ api, request }) => {
  const usuario = await api.criarUsuario();
  const headers = await autenticar(request, usuario);

  expect(headers.Authorization).toMatch(/^Bearer\s+\S+$/);
});

test('rejeita senha inválida de um usuário existente sem emitir token', async ({ api, request }) => {
  const usuario = await api.criarUsuario();
  const response = await request.post('/login', {
    data: { email: usuario.email, password: `${usuario.password}-incorreta` },
  });

  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({ message: 'Email e/ou senha inválidos' });
});

test('rejeita login de usuário não cadastrado', async ({ request }) => {
  const { email, password } = usuarioFactory();
  const response = await request.post('/login', { data: { email, password } });

  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({ message: 'Email e/ou senha inválidos' });
});
