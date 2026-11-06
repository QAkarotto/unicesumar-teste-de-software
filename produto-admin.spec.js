// Usa a fixture personalizada (paginaAdmin) em vez do test padrão.
const { test, expect } = require('../fixtures/admin.fixture');
const { gerarProduto } = require('../helpers/dados');
const { removerProdutoPorNome } = require('../helpers/api');

test.describe('Cenário 2: Cadastro de produto pelo administrador', () => {
  test('administrador cadastra um produto e o encontra na listagem', async ({ paginaAdmin, admin, request }) => {
    const page = paginaAdmin; // já autenticada como admin pela fixture
    const produto = gerarProduto();

    try {
      // Ação 1: cadastrar o produto pela interface
      await page.getByTestId('cadastrarProdutos').click();
      await expect(page).toHaveURL(/\/admin\/cadastrarprodutos/);

      await page.getByTestId('nome').fill(produto.nome);
      await page.getByTestId('preco').fill(produto.preco);
      await page.getByTestId('descricao').fill(produto.descricao);
      await page.getByTestId('quantity').fill(produto.quantidade);
      // O testid do botão tem erro de digitação no código-fonte do front.
      await page.getByTestId('cadastarProdutos').click();

      // Ação 2: acessar a listagem de produtos
      await expect(page).toHaveURL(/\/admin\/listarprodutos/);
      await page.getByTestId('listar-produtos').click();
      await expect(page).toHaveURL(/\/admin\/listarprodutos/);

      // Validação: o produto está na tabela com os dados esperados
      const linha = page.getByRole('row').filter({ hasText: produto.nome });
      await expect(linha).toBeVisible();
      await expect(linha).toContainText(produto.preco);
      await expect(linha).toContainText(produto.descricao);
      await expect(linha).toContainText(produto.quantidade);
    } finally {
      await removerProdutoPorNome(request, admin, produto.nome);
    }
  });
});
