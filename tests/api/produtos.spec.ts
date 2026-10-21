import { test, expect } from '@playwright/test';
import { autenticarUsuario } from '../helpers/auth';
import { criarProduto } from '../data/factories';



test('deve criar produto com usuário autenticado', async ({ request }) => {


    const { token } = await autenticarUsuario(request);


    const produtoDados = criarProduto();



    const respostaProduto = await request.post('/produtos', {


        headers: {

            Authorization: token

        },


        data: produtoDados


    });



    expect(respostaProduto.status()).toBe(201);



    const corpoProduto = await respostaProduto.json();



    expect(corpoProduto.message)
        .toBe('Cadastro realizado com sucesso');



    expect(corpoProduto._id)
        .toBeTruthy();



    const idProduto = corpoProduto._id;



    const consultaProduto = await request.get(
        `/produtos/${idProduto}`
    );



    expect(consultaProduto.status())
        .toBe(200);



    const produtoSalvo = await consultaProduto.json();



    expect(produtoSalvo.nome)
        .toBe(produtoDados.nome);



    expect(produtoSalvo.preco)
        .toBe(produtoDados.preco);


});
test('não deve cadastrar produto com preço inválido', async ({ request }) => {


    const { token } = await autenticarUsuario(request);



    const resposta = await request.post('/produtos', {

        headers: {

            Authorization: token

        },

        data: {

            nome: 'Produto preço inválido',

            preco: -10,

            descricao: 'Produto inválido',

            quantidade: 10

        }

    });



    expect(resposta.status())
        .toBe(400);



});