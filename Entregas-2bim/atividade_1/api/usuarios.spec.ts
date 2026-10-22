import { test, expect } from '@playwright/test';
import { novoUsuario } from './support/factories';
import { cadastrarUsuario } from './support/api';

test.describe('Usuários - /usuarios', () => {
  test('CT01 - deve cadastrar um usuário e consultá-lo pelo _id', async ({ request }) => {
    const usuario = novoUsuario();

    const cadastro = await request.post('/usuarios', { data: usuario });
    expect(cadastro.status()).toBe(201);
    const corpoCadastro = await cadastro.json();
    expect(corpoCadastro.message).toBe('Cadastro realizado com sucesso');
    expect(corpoCadastro._id).toEqual(expect.any(String));

    const consulta = await request.get(`/usuarios/${corpoCadastro._id}`);
    expect(consulta.status()).toBe(200);
    expect(await consulta.json()).toEqual({
      nome: usuario.nome,
      email: usuario.email,
      password: usuario.password,
      administrador: usuario.administrador,
      _id: corpoCadastro._id,
    });
  });

  test('CT02 - não deve permitir cadastrar dois usuários com o mesmo e-mail (regra de negócio)', async ({ request }) => {
    const existente = await cadastrarUsuario(request);

    const response = await request.post('/usuarios', {
      data: novoUsuario({ email: existente.email }),
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ message: 'Este email já está sendo usado' });
  });

  test('CT03 - deve filtrar a listagem de usuários pelo e-mail', async ({ request }) => {
    const usuario = await cadastrarUsuario(request, { administrador: 'false' });

    const response = await request.get('/usuarios', { params: { email: usuario.email } });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.quantidade).toBe(1);
    expect(body.usuarios).toHaveLength(1);
    expect(body.usuarios[0]).toMatchObject({
      _id: usuario._id,
      email: usuario.email,
      administrador: 'false',
    });
  });

  test('CT04 - deve rejeitar cadastro com campos inválidos informando cada erro', async ({ request }) => {
    const response = await request.post('/usuarios', {
      data: { nome: '', email: 'email-sem-arroba', password: 'Senha@123', administrador: 'talvez' },
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toMatchObject({
      nome: 'nome não pode ficar em branco',
      email: 'email deve ser um email válido',
      administrador: "administrador deve ser 'true' ou 'false'",
    });
  });

  test('CT05 - deve retornar erro ao buscar um usuário inexistente', async ({ request }) => {
    // A API exige _id com exatamente 16 caracteres alfanuméricos
    const idInexistente = 'IdInexistente123';
    const response = await request.get(`/usuarios/${idInexistente}`);

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ message: 'Usuário não encontrado' });
  });
});
