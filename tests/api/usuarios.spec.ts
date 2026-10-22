
import { test, expect } from '@playwright/test';
import { criarDadosUsuario } from '../data/factories';
import { criarUsuario } from '../helpers/api';

test('lista usuários e valida os dados retornados', async ({ request }) => {
  const response = await request.get('/usuarios');
  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.quantidade).toBeGreaterThan(0);
  expect(Array.isArray(body.usuarios)).toBe(true);
  expect(body.usuarios[0]).toHaveProperty('_id');
  expect(body.usuarios[0]).toHaveProperty('nome');
  expect(body.usuarios[0]).toHaveProperty('email');
});

test('cria um usuário e consulta os dados persistidos', async ({ request }) => {
  const usuario = criarDadosUsuario();
  const cadastro = await criarUsuario(request, usuario);
  const body = await cadastro.json();

  expect(cadastro.status()).toBe(201);
  expect(body.message).toContain('Cadastro realizado com sucesso');
  expect(body._id).toBeTruthy();

  const consulta = await request.get(`/usuarios/${body._id}`);
  const usuarioSalvo = await consulta.json();

  expect(consulta.status()).toBe(200);
  expect(usuarioSalvo.nome).toBe(usuario.nome);
  expect(usuarioSalvo.email).toBe(usuario.email);
});

test('impede cadastrar dois usuários com o mesmo e-mail', async ({ request }) => {
  const usuario = criarDadosUsuario();

  const primeiroCadastro = await criarUsuario(request, usuario);
  expect(primeiroCadastro.status()).toBe(201);

  const segundoCadastro = await criarUsuario(request, usuario);
  const body = await segundoCadastro.json();

  expect(segundoCadastro.status()).toBe(400);
  expect(body.message).toContain('email');
});

test('rejeita cadastro de usuário com campos inválidos', async ({ request }) => {
  const response = await request.post('/usuarios', {
    data: {
      nome: '',
      email: 'email-invalido',
      password: '',
      administrador: 'false',
    },
  });
  const body = await response.json();

  expect(response.status()).toBe(400);
  expect(body).toHaveProperty('nome');
  expect(body).toHaveProperty('email');
  expect(body).toHaveProperty('password');
});
