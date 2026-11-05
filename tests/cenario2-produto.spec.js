const { test, expect } = require('../fixtures/auth.fixture');

test.describe('Cenário 2 - Cadastro de Produto (Admin)', () => {
  test('Deve cadastrar um produto e exibi-lo na listagem', async ({ adminPage }) => {
    const nomeProduto = `Produto ${Date.now()}`;

    await adminPage.goto('https://front.serverest.dev/admin/cadastrarprodutos');

    await adminPage.locator('#nome').fill(nomeProduto);
    await adminPage.locator('#price').fill('150');
    await adminPage.locator('#description').fill('Descrição do produto de teste');
    await adminPage.locator('#quantity').fill('10');
    await adminPage.getByRole('button', { name: 'Cadastrar' }).click();

    await adminPage.goto('https://front.serverest.dev/admin/listarprodutos');
    await expect(adminPage.getByText(nomeProduto)).toBeVisible();
  });
});
