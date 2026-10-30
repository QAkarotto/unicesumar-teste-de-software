import { test, expect } from '../fixtures/api.fixture';
import { novoUsuario } from '../data/factories';

test('cadastra usuário com dados gerados e persiste o que foi informado', async ({ request, limpeza }) => {
  const usuario = novoUsuario();

  const cadastro = await request.post('/usuarios', { data: usuario });
  expect(cadastro.status()).toBe(201);
  const corpo = await cadastro.json();
  expect(corpo).toEqual({ message: 'Cadastro realizado com sucesso', _id: expect.any(String) });
  limpeza.usuario(corpo._id);

  const consulta = await request.get(`/usuarios/${corpo._id}`);
  expect(consulta.status()).toBe(200);
  expect(await consulta.json()).toEqual({ ...usuario, _id: corpo._id });
});

test('não permite cadastrar dois usuários com o mesmo e-mail', async ({ request, criarUsuario }) => {
  const existente = await criarUsuario();

  const repetido = await request.post('/usuarios', { data: novoUsuario({ email: existente.email }) });
  expect(repetido.status()).toBe(400);
  expect(await repetido.json()).toEqual({ message: 'Este email já está sendo usado' });

  // O cadastro recusado não pode ter sobrescrito nem duplicado o original.
  const busca = await request.get('/usuarios', { params: { email: existente.email } });
  expect(await busca.json()).toEqual({ quantidade: 1, usuarios: [existente] });
});

test('rejeita cadastro com campos inválidos, apontando cada um', async ({ request }) => {
  const resposta = await request.post('/usuarios', {
    data: { nome: '', email: 'email-invalido', password: '', administrador: 'sim' },
  });

  expect(resposta.status()).toBe(400);
  expect(await resposta.json()).toEqual({
    nome: 'nome não pode ficar em branco',
    email: 'email deve ser um email válido',
    password: 'password não pode ficar em branco',
    administrador: "administrador deve ser 'true' ou 'false'",
  });
});

test('altera os dados de um usuário existente', async ({ request, criarUsuario }) => {
  const usuario = await criarUsuario({ administrador: 'true' });
  const alteracao = novoUsuario({ administrador: 'false' });

  const resposta = await request.put(`/usuarios/${usuario._id}`, { data: alteracao });
  expect(resposta.status()).toBe(200);
  expect(await resposta.json()).toEqual({ message: 'Registro alterado com sucesso' });

  const consulta = await request.get(`/usuarios/${usuario._id}`);
  expect(await consulta.json()).toEqual({ ...alteracao, _id: usuario._id });
});

test('exclui usuário, que deixa de ser encontrado', async ({ request, criarUsuario }) => {
  const usuario = await criarUsuario();

  const exclusao = await request.delete(`/usuarios/${usuario._id}`);
  expect(exclusao.status()).toBe(200);
  expect(await exclusao.json()).toEqual({ message: 'Registro excluído com sucesso' });

  const consulta = await request.get(`/usuarios/${usuario._id}`);
  expect(consulta.status()).toBe(400);
  expect(await consulta.json()).toEqual({ message: 'Usuário não encontrado' });
});
