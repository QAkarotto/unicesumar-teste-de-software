
import { test, expect } from '@playwright/test';
import { criarDadosUsuario } from '../data/factories';
import { criarUsuario, fazerLogin } from '../helpers/api';

test('faz login de um usuário cadastrado e retorna autorização', async ({ request }) => {
  const usuario = criarDadosUsuario();

  const cadastro = await criarUsuario(request, usuario);
  expect(cadastro.status()).toBe(201);

  const response = await fazerLogin(
    request,
    usuario.email,
    usuario.password,
  );
  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.message).toContain('Login realizado com sucesso');
  expect(body.authorization).toMatch(/^Bearer /);
});

test('rejeita login com credenciais inválidas', async ({ request }) => {
  const usuario = criarDadosUsuario();

  const response = await fazerLogin(
    request,
    usuario.email,
    usuario.password,
  );
  const body = await response.json();

  expect(response.status()).toBe(401);
  expect(body.message).toContain('inválidos');
});
