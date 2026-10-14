import { test, expect } from '@playwright/test';

//

test('lista o usuário', async ({ request }) => {

const resposta = await request.get('/usuarios');
expect(resposta.status()).toBe(200);

const corpo = await resposta.json();
expect(corpo.quantidade).toBeGreaterThan(0)
expect(corpo.usuarios.length).toBe(corpo.quantidade)

expect(corpo).toHaveProperty('quantidade')
expect(corpo.usuarios[0]).toHaveProperty('nome')
});

//

test('cadastra usuario', async ({ request }) => {

// Gera uma data para registrar como email sem precisar ficar alterando 
const email = `beltrano${Date.now()}@qa.com.br`;

const resposta = await request.post('/usuarios', {data:{nome:"Fulano", email:email, password:"teste", administrador:"true"}});
expect(resposta.status()).toBe(201);
const corpo = await resposta.json();

expect(corpo.message).toBe("Cadastro realizado com sucesso")
expect(corpo).toHaveProperty('_id')

});

//

test('verifica e-mail cadastrado', async ({ request }) => {

const email = `belano${Date.now()}@qa.com.br`;

const cadastroUm = await request.post('/usuarios', {data: {nome:"Jão", email:email, password:"teste", administrador:"true"}});
expect(cadastroUm.status()).toBe(201);

const cadastroDois = await request.post('/usuarios', {data: {nome: "Jao Jao", email:email, password:"Tetee", administrador:"true"}});
expect(cadastroDois.status()).toBe(400);

const corpo = await cadastroDois.json();
expect(corpo.message).toBe("Este email já está sendo usado");

});

test('login com dados corretos', async ({ request }) => {
const email = `betgames${Date.now()}@qa.com.br`;
const senha = `senha${Date.now()}`;

const cadastro = await request.post('/usuarios', {data: {nome:"Jet", email:email, password:senha, administrador:"true"}});
expect(cadastro.status()).toBe(201);

const login = await request.post('/login', {data:{email:email, password:senha}});
expect(login.status()).toBe(200);

const corpo = await login.json();

expect(corpo.message).toBe("Login realizado com sucesso")
expect(corpo).toHaveProperty('authorization')

})


test('login com dados incorretos', async ({ request }) => {
const email = `betgamesbrasil${Date.now()}@qa.com.br`;
const senha = `senha${Date.now()}`;

const cadastro = await request.post('/usuarios', {data: {nome:"Jet", email:email, password:senha, administrador:"true"}});
expect(cadastro.status()).toBe(201);

const login = await request.post('/login', {data:{email:email, password:"senhaErrada"}});
expect(login.status()).toBe(401);

const corpo = await login.json();

expect(corpo.message).toBe("Email e/ou senha inválidos")
expect(corpo).not.toHaveProperty('authorization')

})
