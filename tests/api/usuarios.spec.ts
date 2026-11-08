import { test, expect } from '../fixtures/api.fixture';
import { criarUsuario } from '../data/factories';

test('lista usuários e valida o formato da resposta', async ({ request }) => {
  const response = await request.get('/usuarios');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body.usuarios)).toBe(true);
  expect(body.quantidade).toBe(body.usuarios.length);
});

test('cadastra usuário dinâmico e consulta os dados persistidos', async ({ request, usuario }) => {
  const response = await request.get(`/usuarios/${usuario._id}`);
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual(usuario);
});

test('rejeita cadastro com email inválido', async ({ request }) => {
  const response = await request.post('/usuarios', {
    data: { ...criarUsuario(), email: 'email-invalido' },
  });
  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ email: 'email deve ser um email válido' });
});

test('não permite email duplicado e mantém o usuário original', async ({ request, usuario }) => {
  const response = await request.post('/usuarios', {
    data: { ...criarUsuario(), email: usuario.email },
  });
  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ message: 'Este email já está sendo usado' });
  const consulta = await request.get('/usuarios', { params: { email: usuario.email } });
  expect(consulta.status()).toBe(200);
  expect(await consulta.json()).toEqual({ quantidade: 1, usuarios: [usuario] });
});
