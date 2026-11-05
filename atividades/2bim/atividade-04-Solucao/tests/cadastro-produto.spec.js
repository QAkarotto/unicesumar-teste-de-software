const { test, expect } = require('../fixtures/auth.fixture');

test('Admin deve cadastrar produto', async ({ adminPage }) => {
  const produtoNome = `Produto ${Date.now()}`;
  
  await adminPage.goto('https://front.serverest.dev/admin/cadastrarprodutos');
  
  await adminPage.getByTestId('nome').fill(produtoNome);
  await adminPage.getByTestId('preco').fill('100');
  await adminPage.getByTestId('descricao').fill('Descrição teste');
  await adminPage.getByTestId('quantity').fill('5');
  
  await adminPage.getByRole('button', { name: 'Cadastrar' }).click(); 
  
  await adminPage.goto('https://front.serverest.dev/admin/listarprodutos');
  await expect(adminPage.getByText(produtoNome)).toBeVisible();
});