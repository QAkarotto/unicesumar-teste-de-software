const { test, expect } = require('../../fixtures/admin.fixture');
const { preencherCampo } = require('../../helpers/form');
const { randomUUID } = require('node:crypto');

test('Cenário 2 - administrador cadastra produto e verifica a listagem', async ({ adminPage }) => {

    const identificador = randomUUID().slice(0, 8);

    const produto = {
        nome: `Produto E2E ${identificador}`,
        preco: '149',
        descricao: `Produto criado pelo teste automatizado ${identificador}`,
        quantidade: '25',
    };

    await adminPage.goto('/admin/cadastrarprodutos');

    await preencherCampo(adminPage, 'nome', produto.nome);
    await preencherCampo(adminPage, 'preco', produto.preco);
    await preencherCampo(adminPage, 'descricao', produto.descricao);
    await preencherCampo(adminPage, 'quantity', produto.quantidade);

    await adminPage.getByRole('button', { name: 'Cadastrar' }).click();

    await adminPage.goto('/admin/listarprodutos');

    await expect(
        adminPage.getByRole('heading', { name: 'Lista dos Produtos' })
    ).toBeVisible();

    const celulaNome = adminPage.getByRole('cell', {
        name: produto.nome,
        exact: true
    });

    const linhaProduto = adminPage.getByRole('row').filter({
        has: celulaNome
    });

    await expect(linhaProduto).toHaveCount(1);
    await expect(linhaProduto.locator('td').nth(0)).toHaveText(produto.nome);
    await expect(linhaProduto.locator('td').nth(1)).toHaveText(produto.preco);
    await expect(linhaProduto.locator('td').nth(2)).toHaveText(produto.descricao);
    await expect(linhaProduto.locator('td').nth(3)).toHaveText(produto.quantidade);
});