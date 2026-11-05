
const { test, expect } = require('../fixtures/admin.fixture');

test('Cenário 2 - Cadastro de produto pelo administrador', async ({ adminPage }) => {
  const page = adminPage;

  // Gera um produto único para evitar conflitos
  const id = `${Date.now()}${Math.random().toString(36).slice(2, 7)}`;

  const produto = {
    nome: `Produto E2E ${id}`,
    preco: '150',
    descricao: `Produto criado pelo Playwright ${id}`,
    quantidade: '10',
  };

  // Acessa a tela de cadastro de produtos
  await page.getByTestId('cadastrarProdutos').click();

  // Preenche o formulário pela interface web
  await page.getByTestId('nome').fill(produto.nome);
  await page.getByTestId('preco').fill(produto.preco);
  await page.getByTestId('descricao').fill(produto.descricao);
  await page.getByTestId('quantity').fill(produto.quantidade);

  // Realiza o cadastro
  await page.getByTestId('cadastarProdutos').click();

  // Verifica a listagem de produtos
  await expect(page).toHaveURL(/listarprodutos/);

  // Confirma que o produto foi cadastrado
  const linha = page.getByRole('row').filter({
    hasText: produto.nome,
  });

  await expect(linha).toBeVisible();
  await expect(linha).toContainText(produto.preco);
  await expect(linha).toContainText(produto.descricao);
  await expect(linha).toContainText(produto.quantidade);
});
