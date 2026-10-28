
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('Deve consultar usuario pelo ID', async ({ request }) => {

  const usuario = {
    nome: faker.person.fullName(),
    email: `consulta${Date.now()}@teste.com`,
    password: faker.internet.password(),
    administrador: 'false'
  };

  const cadastro = await request.post('/usuarios', {
    data: usuario
  });

  expect(cadastro.status()).toBe(201);

  const dadosCadastro = await cadastro.json();
  const id = dadosCadastro._id;

  expect(id).toBeTruthy();

  try {
    const resposta = await request.get(`/usuarios/${id}`);

    expect(resposta.status()).toBe(200);

    const dados = await resposta.json();

    expect(dados.nome).toBe(usuario.nome);
    expect(dados.email).toBe(usuario.email);
    expect(dados.administrador).toBe('false');
    expect(dados._id).toBe(id);

  } finally {
    await request.delete(`/usuarios/${id}`);
  }

});
