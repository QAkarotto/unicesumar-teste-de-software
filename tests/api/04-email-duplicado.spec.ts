
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('Nao deve permitir email duplicado', async ({ request }) => {

  const usuario = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password:  faker.internet.password(),
    administrador: 'true'
  };

  const primeiroCadastro = await request.post('/usuarios', {
    data: usuario
  });

  expect(primeiroCadastro.status()).toBe(201);

  const dadosPrimeiro = await primeiroCadastro.json();
  const id = dadosPrimeiro._id;

  expect(id).toBeTruthy();

  try {
    // Tentar cadastrar novamente o mesmo email
    const segundoCadastro = await request.post('/usuarios', {
      data: usuario
    });

    // A API deve recusar o cadastro
    expect(segundoCadastro.status()).toBe(400);

    const dados = await segundoCadastro.json();

    expect(dados.message).toBe('Este email já está sendo usado');

  } finally {
    await request.delete(`/usuarios/${id}`);
  }

});
