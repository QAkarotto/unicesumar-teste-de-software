
import { test, expect } from '@playwright/test';

test('Deve excluir um usuario cadastrado', async ({ request }) => {

  const usuario = {
    nome: 'Usuario Exclusao',
    email: `exclusao${Date.now()}@teste.com`,
    password: '123456',
    administrador: 'false'
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
