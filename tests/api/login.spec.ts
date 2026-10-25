import { test, expect } from '../fixtures/api.fixture';
import { autenticar } from '../helpers/auth';

test('autentica com credenciais válidas', async ({ request, usuario }) => {
  const token = await autenticar(request, usuario);
  expect(token).toMatch(/^Bearer \S+$/);
});

test('rejeita senha inválida de usuário existente', async ({ request, usuario }) => {
  const response = await request.post('/login', {
    data: { email: usuario.email, password: `${usuario.password}-incorreta` },
  });
  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({ message: 'Email e/ou senha inválidos' });
});
