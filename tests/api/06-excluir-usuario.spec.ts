
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('Deve excluir um usuario cadastrado', async ({ request }) => {

  const usuario = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password:  faker.internet.password(),
    administrador: 'true'
  };

  // Cadastrar usuario
  const cadastro = await request.post('/usuarios', {
    data: usuario
  });

  expect(cadastro.status()).toBe(201);

  const dadosCadastro = await cadastro.json();
  const id = dadosCadastro._id;

  expect(id).toBeTruthy();

  // Excluir usuario
  const resposta = await request.delete(`/usuarios/${id}`);

  expect(resposta.status()).toBe(200);

  const dados = await resposta.json();

  expect(dados.message).toBe('Registro excluído com sucesso');

  // Verificar se o usuario realmente foi excluido
  const consulta = await request.get(`/usuarios/${id}`);

  expect(consulta.status()).toBe(400);

  const dadosConsulta = await consulta.json();

  expect(dadosConsulta.message).toBe('Usuário não encontrado');

});
