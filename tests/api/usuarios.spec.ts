import { test, expect } from '@playwright/test';
import { criarUsuario } from '../data/factories';



test('deve criar um usuário com sucesso', async ({ request }) => {


    const novoUsuario = criarUsuario();



    const resposta = await request.post('/usuarios', {

        data: novoUsuario

    });



    expect(resposta.status())
        .toBe(201);



    const corpo = await resposta.json();



    expect(corpo.message)
        .toBe('Cadastro realizado com sucesso');



    expect(corpo._id)
        .toBeTruthy();



    const idUsuario = corpo._id;



    const consulta = await request.get(
        `/usuarios/${idUsuario}`
    );



    expect(consulta.status())
        .toBe(200);



    const usuarioSalvo = await consulta.json();



    expect(usuarioSalvo.nome)
        .toBe(novoUsuario.nome);



    expect(usuarioSalvo.email)
        .toBe(novoUsuario.email);


});





test('deve listar usuários cadastrados', async ({ request }) => {


    const resposta = await request.get('/usuarios');



    expect(resposta.status())
        .toBe(200);



    const corpo = await resposta.json();



    expect(corpo)
        .toHaveProperty('usuarios');



    expect(Array.isArray(corpo.usuarios))
        .toBeTruthy();


});





test('não deve permitir cadastrar usuário com email duplicado', async ({ request }) => {


    const usuario = criarUsuario();



    const primeiroCadastro = await request.post('/usuarios', {

        data: usuario

    });



    expect(primeiroCadastro.status())
        .toBe(201);




    const segundoCadastro = await request.post('/usuarios', {

        data: usuario

    });



    expect(segundoCadastro.status())
        .toBe(400);



    const corpo = await segundoCadastro.json();



    expect(corpo.message)
        .toBe('Este email já está sendo usado');


});
test('não deve cadastrar usuário sem email', async ({ request }) => {


    const usuarioInvalido = {

        nome: 'Usuário sem email',

        password: '123456',

        administrador: 'true'

    };



    const resposta = await request.post('/usuarios', {

        data: usuarioInvalido

    });



    expect(resposta.status())
        .toBe(400);



    const corpo = await resposta.json();


    expect(corpo)
        .toBeTruthy();


});