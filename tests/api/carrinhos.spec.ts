import { test, expect } from '../fixtures/api.fixture';
import {
    criarProdutoAutenticado,
    removerProduto,
} from '../helpers/api';

test.describe('API de Carrinhos', () => {
    test('deve listar carrinhos com estrutura válida', async ({ request }) => {
        const resposta = await request.get('/carrinhos');

        expect(resposta.status()).toBe(200);

        const dados = await resposta.json();

        expect(dados).toHaveProperty('quantidade');
        expect(dados).toHaveProperty('carrinhos');
        expect(Array.isArray(dados.carrinhos)).toBe(true);
        expect(dados.quantidade).toBe(dados.carrinhos.length);
    });

    test('deve rejeitar a criação de carrinho sem autenticação', async ({ request }) => {
        const resposta = await request.post('/carrinhos', {
            data: {
                produtos: [
                    {
                        id: 'id-inexistente',
                        quantidade: 1,
                    },
                ],
            },
        });

        expect(resposta.status()).toBe(401);

        const dados = await resposta.json();

        expect(dados).toHaveProperty('message');
    });

    test('deve criar um carrinho autenticado com produto válido', async ({
        request,
        usuarioAdmin,
    }) => {
        let produtoId: string | undefined;
        let carrinhoCriado = false;

        try {
            const produto = await criarProdutoAutenticado(
                request,
                usuarioAdmin.token,
            );

            produtoId = produto.produtoId;

            const resposta = await request.post('/carrinhos', {
                headers: {
                    Authorization: usuarioAdmin.token,
                },
                data: {
                    produtos: [
                        {
                            idProduto: produto.produtoId,
                            quantidade: 1,
                        },
                    ],
                },
            });

            const corpoResposta = await resposta.json();

            expect(resposta.status()).toBe(201);
            expect(corpoResposta.message).toBe(
                'Cadastro realizado com sucesso',
            );

            carrinhoCriado = true;

            const consulta = await request.get('/carrinhos', {
                headers: {
                    Authorization: usuarioAdmin.token,
                },
            });

            expect(consulta.status()).toBe(200);

            const dadosConsulta = await consulta.json();

            expect(Array.isArray(dadosConsulta.carrinhos)).toBe(true);
            expect(
                dadosConsulta.carrinhos.some(
                    (carrinho: { idUsuario: string }) =>
                        carrinho.idUsuario === usuarioAdmin.usuarioId,
                ),
            ).toBe(true);
        } finally {
            if (carrinhoCriado) {
                const cancelamento = await request.delete(
                    '/carrinhos/cancelar-compra',
                    {
                        headers: {
                            Authorization: usuarioAdmin.token,
                        },
                    },
                );

                expect(cancelamento.ok()).toBe(true);
            }

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
