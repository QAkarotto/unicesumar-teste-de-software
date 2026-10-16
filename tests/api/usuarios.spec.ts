import { test, expect } from '@playwright/test';
import { criarUsuario, novoUsuario } from './helpers';

test.describe('API ServeRest - Usuários', () => {
  test('cadastra usuário com sucesso (201)', async ({ request }) => {
    const usuario = novoUsuario();
    const resp = await request.post('/usuarios', { data: usuario });

    expect(resp.status()).toBe(201);
    const body = await resp.json();
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body._id).toBeTruthy();
  });

  test('consulta usuário cadastrado pelo _id (200)', async ({ request }) => {
    const usuario = await criarUsuario(request);
    const resp = await request.get(`/usuarios/${usuario._id}`);

    expect(resp.status()).toBe(200);
    const body = await resp.json();
    expect(body._id).toBe(usuario._id);
    expect(body.nome).toBe(usuario.nome);
    expect(body.email).toBe(usuario.email);
    expect(body.administrador).toBe('true');
  });

    test('regra de negócio: não permite e-mail duplicado (400)', async ({ request }) => {
    const usuario = await criarUsuario(request);
    const { _id, ...dadosCadastro } = usuario;

    const resp = await request.post('/usuarios', { data: dadosCadastro });

    expect(resp.status()).toBe(400);
    const body = await resp.json();
    expect(body.message).toBe('Este email já está sendo usado');
  });

  test('cenário inválido: cadastro sem campos obrigatórios (400)', async ({ request }) => {
    const resp = await request.post('/usuarios', { data: {} });

    expect(resp.status()).toBe(400);
    const body = await resp.json();
    expect(body.nome).toBe('nome é obrigatório');
    expect(body.email).toBe('email é obrigatório');
    expect(body.password).toBe('password é obrigatório');
    expect(body.administrador).toBe('administrador é obrigatório');
  });

  test('exclui usuário e confirma que deixou de existir', async ({ request }) => {
    const usuario = await criarUsuario(request);

    const del = await request.delete(`/usuarios/${usuario._id}`);
    expect(del.status()).toBe(200);
    expect((await del.json()).message).toBe('Registro excluído com sucesso');

    const consulta = await request.get(`/usuarios/${usuario._id}`);
    expect(consulta.status()).toBe(400);
    expect((await consulta.json()).message).toBe('Usuário não encontrado');
  });
});
