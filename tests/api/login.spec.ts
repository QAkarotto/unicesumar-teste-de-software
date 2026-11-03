import { test, expect } from '@playwright/test';
import { autenticarUsuario } from '../helpers/auth';
import { criarUsuario } from '../data/factories';



test('deve realizar login com sucesso', async ({ request }) => {


    const resultado = await autenticarUsuario(request);



    const resposta = await request.post('/login', {

        data: {

            email: resultado.usuario.email,

            password: resultado.usuario.password

        }

    });



    expect(resposta.status())
        .toBe(200);



    const corpo = await resposta.json();



    expect(corpo.message)
        .toBe('Login realizado com sucesso');



    expect(corpo.authorization)
        .toBeTruthy();


});





test('não deve realizar login com senha inválida', async ({ request }) => {


    const usuario = criarUsuario();



    const cadastro = await request.post('/usuarios', {

        data: usuario

    });



    expect(cadastro.status())
        .toBe(201);




    const resposta = await request.post('/login', {

        data: {

            email: usuario.email,

            password: 'senhaerrada'

        }

    });



    expect(resposta.status())
        .toBe(401);



    const corpo = await resposta.json();



    expect(corpo.message)
        .toBe('Email e/ou senha inválidos');


});