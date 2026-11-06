import { test, expect } from '../fixtures/api.fixture';
import { usuarioFactory } from '../data/factories';

test('cadastra usuário com dados dinâmicos e consulta os valores persistidos', async ({ api, request }) => {
  const usuario = await api.criarUsuario();
  const response = await request.get(`/usuarios/${usuario._id}`);

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual(usuario);
});

test('rejeita cadastro com e-mail inválido sem persistir usuário', async ({ api, request }) => {
  const dados = usuarioFactory();
  const usuario = { ...dados, nome: `Inválido ${dados.email}`, email: 'email-invalido' };
  const response = await api.cadastrarUsuario(usuario);

  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ email: 'email deve ser um email válido' });
  const consulta = await request.get('/usuarios', { params: { nome: usuario.nome } });
  expect(consulta.status()).toBe(200);
  expect(await consulta.json()).toEqual({ quantidade: 0, usuarios: [] });
});

test('bloqueia e-mail duplicado e preserva o usuário original', async ({ api, request }) => {
  const usuario = await api.criarUsuario();
  const response = await api.cadastrarUsuario(usuarioFactory({ email: usuario.email }));

  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ message: 'Este email já está sendo usado' });
  const consulta = await request.get('/usuarios', { params: { email: usuario.email } });
  expect(consulta.status()).toBe(200);
  expect(await consulta.json()).toEqual({ quantidade: 1, usuarios: [usuario] });
});
