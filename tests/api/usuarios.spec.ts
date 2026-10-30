import { test, expect } from '@playwright/test';

function novoUsuario() {
  const id = `${Date.now()}${Math.floor(Math.random() * 1e6)}`;
  return { nome: `Usuário ${id}`, email: `usuario.${id}@qa.com`, password: 'senha123', administrador: 'true' };
}

const usuariosCriados: string[] = [];

test.afterEach(async ({ request }) => {
  for (const id of usuariosCriados.splice(0)) await request.delete(`/usuarios/${id}`);
});

test('cadastra usuário e persiste os dados informados', async ({ request }) => {
  const usuario = novoUsuario();

  const cadastro = await request.post('/usuarios', { data: usuario });
  expect(cadastro.status()).toBe(201);
  const corpo = await cadastro.json();
  expect(corpo).toEqual({ message: 'Cadastro realizado com sucesso', _id: expect.any(String) });
  usuariosCriados.push(corpo._id);

  const consulta = await request.get(`/usuarios/${corpo._id}`);
  expect(consulta.status()).toBe(200);
  expect(await consulta.json()).toEqual({ ...usuario, _id: corpo._id });
});

test('não permite cadastrar dois usuários com o mesmo e-mail', async ({ request }) => {
  const usuario = novoUsuario();
  const primeiro = await request.post('/usuarios', { data: usuario });
  expect(primeiro.status()).toBe(201);
  usuariosCriados.push((await primeiro.json())._id);

  const repetido = await request.post('/usuarios', { data: { ...usuario, nome: 'Outro Nome' } });
  expect(repetido.status()).toBe(400);
  expect(await repetido.json()).toEqual({ message: 'Este email já está sendo usado' });

  // O cadastro recusado não pode ter sobrescrito nem duplicado o original.
  const busca = await request.get('/usuarios', { params: { email: usuario.email } });
  const { quantidade, usuarios } = await busca.json();
  expect(quantidade).toBe(1);
  expect(usuarios[0].nome).toBe(usuario.nome);
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

test('exclui usuário, que deixa de ser encontrado', async ({ request }) => {
  const cadastro = await request.post('/usuarios', { data: novoUsuario() });
  expect(cadastro.status()).toBe(201);
  const { _id } = await cadastro.json();
  usuariosCriados.push(_id);

  const exclusao = await request.delete(`/usuarios/${_id}`);
  expect(exclusao.status()).toBe(200);
  expect(await exclusao.json()).toEqual({ message: 'Registro excluído com sucesso' });

  const consulta = await request.get(`/usuarios/${_id}`);
  expect(consulta.status()).toBe(400);
  expect(await consulta.json()).toEqual({ message: 'Usuário não encontrado' });
});
