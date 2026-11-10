
import { test, expect } from '@playwright/test';

function novoUsuario() {
  const identificador = `${Date.now()}-${Math.random()
    .toString(36).slice(2, 8)}`;

  return {
    nome: 'Usuario Teste',
    email: `teste-${identificador}@exemplo.com`,
    password: 'SenhaTeste123',
    administrador: 'false'
  };
}

test.describe('API de usuários', () => {
  test('deve listar usuários cadastrados', async ({ request }) => {
    const response = await request.get('/usuarios');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('quantidade');
    expect(body).toHaveProperty('usuarios');
    expect(Array.isArray(body.usuarios)).toBe(true);
    expect(body.quantidade).toBe(body.usuarios.length);
  });

  test('deve cadastrar um usuário válido', async ({ request }) => {
    const usuario = novoUsuario();

    const response = await request.post('/usuarios', {
      data: usuario
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body._id).toBeTruthy();

    const consulta = await request.get(`/usuarios/${body._id}`);
    expect(consulta.status()).toBe(200);

    const usuarioCadastrado = await consulta.json();

    expect(usuarioCadastrado.nome).toBe(usuario.nome);
    expect(usuarioCadastrado.email).toBe(usuario.email);
    expect(usuarioCadastrado.administrador).toBe('false');
  });

  test('não deve permitir cadastrar e-mail duplicado', async ({ request }) => {
    const usuario = novoUsuario();

    const primeiroCadastro = await request.post('/usuarios', {
      data: usuario
    });

    expect(primeiroCadastro.status()).toBe(201);

    const segundoCadastro = await request.post('/usuarios', {
      data: usuario
    });

    expect(segundoCadastro.status()).toBe(400);

    const body = await segundoCadastro.json();

    expect(body.message).toBe('Este email já está sendo usado');
  });
});
