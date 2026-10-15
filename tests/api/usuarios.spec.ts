import { test, expect } from '@playwright/test';
import { criarUsuario, excluirUsuario, gerarUsuario } from './helpers/serverest';

test.describe('API ServeRest - Usuários', () => {
  const idsCriados: string[] = [];

  test.afterAll(async ({ request }) => {
    for (const id of idsCriados) await excluirUsuario(request, id);
  });

  test('deve cadastrar um usuário com sucesso', async ({ request }) => {
    const usuario = gerarUsuario();

    const res = await request.post('/usuarios', { data: usuario });
    const body = await res.json();

    expect(res.status()).toBe(201);
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body._id).toEqual(expect.any(String));
    idsCriados.push(body._id);
  });

  test('deve consultar um usuário por ID e retornar os dados cadastrados', async ({ request }) => {
    const usuario = gerarUsuario(false);
    const id = await criarUsuario(request, usuario);
    idsCriados.push(id);

    const res = await request.get(`/usuarios/${id}`);
    const body = await res.json();

    expect(res.status()).toBe(200);
    expect(body).toMatchObject({
      nome: usuario.nome,
      email: usuario.email,
      administrador: 'false',
      _id: id,
    });
  });

  test('regra de negócio: não deve permitir cadastrar e-mail já utilizado', async ({ request }) => {
    const usuario = gerarUsuario();
    idsCriados.push(await criarUsuario(request, usuario));

    const res = await request.post('/usuarios', { data: { ...usuario, nome: 'Outro Nome' } });
    const body = await res.json();

    expect(res.status()).toBe(400);
    expect(body.message).toBe('Este email já está sendo usado');
    expect(body._id).toBeUndefined();
  });

  test('cenário inválido: não deve cadastrar usuário sem e-mail', async ({ request }) => {
    const { email, ...semEmail } = gerarUsuario();

    const res = await request.post('/usuarios', { data: semEmail });
    const body = await res.json();

    expect(res.status()).toBe(400);
    expect(body.email).toBe('email é obrigatório');
  });

  test('cenário inválido: deve informar erro ao buscar usuário inexistente', async ({ request }) => {
    const res = await request.get('/usuarios/idInexistente123');
    const body = await res.json();

    expect(res.status()).toBe(400);
    expect(body.message).toBe('Usuário não encontrado');
  });
});
