import { test, expect } from '@playwright/test';
import { request } from 'http';

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



});