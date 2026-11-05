
import { test, expect } from '../fixtures/admin.fixture';
import { criarProduto } from '../data/factories';
import { preencherCampo } from '../helpers/web';

test('administrador deve cadastrar e visualizar um produto', async ({
    adminPage,
}) => {
    const produto = criarProduto();

    // Acesso à tela de cadastro de produtos.
    await adminPage.goto('/admin/cadastrarprodutos');

    // Cadastro pela interface.
    await preencherCampo(
        adminPage,
        'nome',
        adminPage.locator('input').nth(0),
        produto.nome,
    );

    await preencherCampo(
        adminPage,
        'preco',
        adminPage.locator('input').nth(1),
        String(produto.preco),
    );

    await preencherCampo(
        adminPage,
        'descricao',
        adminPage.locator('textarea').nth(0),
        produto.descricao,
    );

    await preencherCampo(
        adminPage,
        'quantidade',
        adminPage.locator('input').nth(2),
        String(produto.quantidade),
    );

    await adminPage.getByRole('button', {
        name: /cadastrar/i,
    }).click();

    // Verifica o redirecionamento para a listagem.
    await expect(adminPage).toHaveURL(/\/admin\/listarprodutos/);

    // Confirma que o produto está disponível.
    await expect(
        adminPage.getByText(produto.nome, { exact: true }),
    ).toBeVisible();
});
