import { test, expect, newUser } from './fixtures';

test('cadastra usuário e persiste os dados enviados', async ({ request, createUser }) => {
  const user = await createUser();
  const response = await request.get(`/usuarios/${user._id}`);
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual(user);
});

test('filtra usuários por email', async ({ request, createUser }) => {
  const user = await createUser();
  const response = await request.get('/usuarios', { params: { email: user.email } });
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ quantidade: 1, usuarios: [user] });
});

test('atualiza usuário e confirma a persistência', async ({ request, createUser }) => {
  const { _id, ...data } = await createUser();
  const updated = { ...data, nome: 'Aluno Atualizado' };
  const response = await request.put(`/usuarios/${_id}`, { data: updated });
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ message: 'Registro alterado com sucesso' });
  const lookup = await request.get(`/usuarios/${_id}`);
  expect(lookup.status()).toBe(200);
  expect(await lookup.json()).toEqual({ ...updated, _id });
});

test('exclui usuário e confirma que não pode mais ser consultado', async ({ request, createUser }) => {
  const user = await createUser();
  const response = await request.delete(`/usuarios/${user._id}`);
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ message: 'Registro excluído com sucesso' });
  const lookup = await request.get(`/usuarios/${user._id}`);
  expect(lookup.status()).toBe(400);
  expect(await lookup.json()).toEqual({ message: 'Usuário não encontrado' });
});

test('impede email duplicado sem alterar o usuário original', async ({ request, createUser }) => {
  const user = await createUser();
  const response = await request.post('/usuarios', {
    data: { ...newUser(), email: user.email, nome: 'Tentativa duplicada' },
  });
  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ message: 'Este email já está sendo usado' });
  const lookup = await request.get('/usuarios', { params: { email: user.email } });
  expect(lookup.status()).toBe(200);
  expect(await lookup.json()).toEqual({ quantidade: 1, usuarios: [user] });
});

test('rejeita cadastro com email inválido', async ({ request }) => {
  const response = await request.post('/usuarios', { data: { ...newUser(), email: 'email-invalido' } });
  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ email: 'email deve ser um email válido' });
});

test('rejeita cadastro sem nome obrigatório', async ({ request }) => {
  const { nome: _nome, ...data } = newUser();
  const response = await request.post('/usuarios', { data });
  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ nome: 'nome é obrigatório' });
});

test('realiza login e consulta carrinhos enviando o token retornado', async ({ request, createUser }) => {
  const user = await createUser();
  const response = await request.post('/login', {
    data: { email: user.email, password: user.password },
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toEqual({ message: 'Login realizado com sucesso', authorization: expect.any(String) });
  expect(body.authorization).toMatch(/^Bearer \S+$/);
  const carts = await request.get('/carrinhos', { headers: { Authorization: body.authorization } });
  expect(carts.status()).toBe(200);
  const cartBody = await carts.json();
  expect(cartBody.carrinhos).toEqual(expect.any(Array));
  expect(cartBody.quantidade).toBe(cartBody.carrinhos.length);
});

test('rejeita login com senha incorreta', async ({ request, createUser }) => {
  const user = await createUser();
  const response = await request.post('/login', {
    data: { email: user.email, password: 'SenhaIncorreta' },
  });
  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({ message: 'Email e/ou senha inválidos' });
});
