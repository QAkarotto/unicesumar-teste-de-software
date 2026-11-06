const { test, expect } = require('../fixtures/auth.fixture');
const { gerarProduto } = require('../support/data');

test('Cenário 2: administrador cadastra produto e o encontra na listagem', async ({ adminPage: page }) => {
  const produto = gerarProduto();

  await test.step('Cadastrar produto pela interface', async () => {
    await page.getByTestId('cadastrarProdutos').click();
    await expect(page).toHaveURL(/admin\/cadastrarprodutos/);

    await page.getByTestId('nome').fill(produto.nome);
    await page.getByTestId('preco').fill(produto.preco);
    await page.getByTestId('descricao').fill(produto.descricao);
    await page.getByTestId('quantity').fill(produto.quantidade);
    await page.getByTestId('cadastarProdutos').click();
  });

  await test.step('Acessar a listagem e validar os dados do produto', async () => {
    await expect(page).toHaveURL(/admin\/listarprodutos/);

    const linha = page.getByRole('row').filter({ hasText: produto.nome });
    await expect(linha).toHaveCount(1);
    await expect(linha).toContainText(produto.preco);
    await expect(linha).toContainText(produto.descricao);
    await expect(linha).toContainText(produto.quantidade);
  });
});