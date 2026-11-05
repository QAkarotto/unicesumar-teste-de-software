
import type { APIRequestContext } from '@playwright/test';
import { criarProduto } from '../data/factories';

export async function criarProdutoAutenticado(
    request: APIRequestContext,
    token: string,
) {
    const produto = criarProduto();

    const resposta = await request.post('/produtos', {
        data: produto,
        headers: {
            Authorization: token,
        },
    });

    if (resposta.status() !== 201) {
        throw new Error(
            `Falha ao cadastrar produto de teste: ${await resposta.text()}`,
        );
    }

    const dados = await resposta.json();

    return {
        produto,
        produtoId: dados._id as string,
    };
}

export async function removerProduto(
    request: APIRequestContext,
    produtoId: string,
    token: string,
) {
    const resposta = await request.delete(`/produtos/${produtoId}`, {
        headers: {
            Authorization: token,
        },
    });

    if (!resposta.ok()) {
        throw new Error(
            `Falha ao remover produto de teste: ${await resposta.text()}`,
        );
    }
}
