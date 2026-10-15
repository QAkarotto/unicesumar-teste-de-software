
import { test, expect } from '@playwright/test';

test('Deve cadastrar um usuario com sucesso', async ({ request }) => {

  const usuario = {
    nome: 'Victor Teste',
    email: `victor${Date.now()}@teste.com`,
    password: '123456',
    administrador: 'true'
  };

  const resposta = await request.post('/usuarios', {
    data: usuario
  });

  expect(resposta.status()).toBe(201);

  const dados = await resposta.json();

  expect(dados.message).toBe('Cadastro realizado com sucesso');
  expect(dados._id).toBeTruthy();

  // Remove o usuario criado, mesmo se uma validacao falhar
  try {
    expect(dados._id).toEqual(expect.any(String));
  } finally {
    if (dados._id) {
      await request.delete(`/usuarios/${dados._id}`);
    }
  }

});
