
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('Deve cadastrar um usuario com sucesso', async ({ request }) => {

  const usuario = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password:  faker.internet.password(),
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



test('Não deve permitir email duplicado', async ({ request }) => {

  const usuario = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    administrador: 'true'
  };

  let idUsuario: string | undefined;

  try {
    const primeiraResposta = await request.post('/usuarios', {
      data: usuario
    });

    expect(primeiraResposta.status()).toBe(201);

    const dados = await primeiraResposta.json();
    idUsuario = dados._id;

    const segundaResposta = await request.post('/usuarios', {
      data: usuario
    });

    expect(segundaResposta.status()).toBe(400);

    const dadosErro = await segundaResposta.json();

    expect(dadosErro.message).toBe('Este email já está sendo usado');

  } finally {
    if (idUsuario) {
      await request.delete(`/usuarios/${idUsuario}`);
    }
  }
});
