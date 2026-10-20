import { test, expect } from '../fixtures/api.fixture';
import { criarProdutoAutenticado, removerProduto } from '../helpers/api';

test.describe('API de Produtos', () => {
    test('deve listar produtos com estrutura válida', async ({ request }) => {
        const resposta = await request.get('/produtos');

        expect(resposta.status()).toBe(200);

        const dados = await resposta.json();

        expect(dados).toHaveProperty('quantidade');
        expect(dados).toHaveProperty('produtos');
        expect(Array.isArray(dados.produtos)).toBe(true);
        expect(dados.quantidade).toBe(dados.produtos.length);
    });

    test('deve impedir cadastro de produto sem autenticação', async ({ request }) => {
        const resposta = await request.post('/produtos', {
            data: {
                nome: `Produto sem token ${crypto.randomUUID()}`,
                preco: 100,
                descricao: 'Produto para teste de autenticação',
                quantidade: 10,
            },
        });

        expect(resposta.status()).toBe(401);

        const dados = await resposta.json();

        expect(dados).toHaveProperty('message');
    });

    test('deve cadastrar e consultar um produto autenticado', async ({
        request,
        usuarioAdmin,
    }) => {
        let produtoId: string | undefined;

        try {
            const criado = await criarProdutoAutenticado(
                request,
                usuarioAdmin.token,
            );

            produtoId = criado.produtoId;

            const consulta = await request.get(`/produtos/${produtoId}`);

            expect(consulta.status()).toBe(200);

            const dados = await consulta.json();

            expect(dados.nome).toBe(criado.produto.nome);
            expect(dados.preco).toBe(criado.produto.preco);
            expect(dados.descricao).toBe(criado.produto.descricao);
            expect(dados.quantidade).toBe(criado.produto.quantidade);
        } finally {
            if (produtoId) {
                await removerProduto(
                    request,
                    produtoId,
                    usuarioAdmin.token,
                );
            }
        }
    });
});
