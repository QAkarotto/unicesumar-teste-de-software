import { test, expect } from '@playwright/test';
import { createUser, deleteUser } from '../helpers/api';
import { makeUser } from '../data/factories';

test('cadastro dinâmico persiste dados do usuário', async ({ request }) => {
  const user = await createUser(request, makeUser());
  try {
    const response = await request.get(`/usuarios/${user.id}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ nome: user.data.nome, email: user.data.email, administrador: user.data.administrador, _id: user.id });
  } finally { await deleteUser(request, user.id); }
});

test('cadastro com email inválido retorna erro', async ({ request }) => {
  const response = await request.post('/usuarios', { data: { ...makeUser(), email: 'invalido' } });
  expect(response.status()).toBe(400);
  expect((await response.json()).email).toBeTruthy();
});

test('regra de negócio: email duplicado não é permitido', async ({ request }) => {
  const user = await createUser(request);
  try {
    const response = await request.post('/usuarios', { data: user.data });
    expect(response.status()).toBe(400);
    expect((await response.json()).message).toBe('Este email já está sendo usado');
  } finally { await deleteUser(request, user.id); }
});

test('alteração de usuário fica persistida', async ({ request }) => {
  const user = await createUser(request);
  try {
    const novoNome = `Atualizado ${Date.now()}`;
    const response = await request.put(`/usuarios/${user.id}`, { data: { ...user.data, nome: novoNome } });
    expect(response.status()).toBe(200);
    expect((await response.json()).message).toBe('Registro alterado com sucesso');
    const consulta = await request.get(`/usuarios/${user.id}`);
    expect(consulta.status()).toBe(200);
    expect((await consulta.json()).nome).toBe(novoNome);
  } finally { await deleteUser(request, user.id); }
});

test('exclusão de usuário altera o estado final', async ({ request }) => {
  const user = await createUser(request);
  const response = await request.delete(`/usuarios/${user.id}`);
  expect(response.status()).toBe(200);
  expect((await response.json()).message).toBe('Registro excluído com sucesso');
  const consulta = await request.get(`/usuarios/${user.id}`);
  expect(consulta.status()).toBe(400);
  expect((await consulta.json()).message).toBe('Usuário não encontrado');
});
