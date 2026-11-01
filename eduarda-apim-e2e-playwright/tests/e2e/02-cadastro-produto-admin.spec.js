const { test, expect } = require('../fixtures/auth');
const { gerarProduto } = require('../support/dados');
const { cadastrarProdutoPelaUI } = require('../support/paginas');

test.describe('Cenário 2: cadastro de produto pelo administrador', () => {
  test('administrador cadastra produto e o encontra na listagem', async ({ adminPage }) => {
    // Preparação
    const produto = gerarProduto();

    // Ação 1: cadastro pela interface
    await cadastrarProdutoPelaUI(adminPage, produto);

    // O front redireciona para a listagem após o cadastro
    await expect(adminPage).toHaveURL(/\/admin\/listarprodutos/);

    // Ação 2: acesso explícito à listagem
    await adminPage.goto('/admin/listarprodutos');

    // Validação: linha do produto com os dados esperados
    const linha = adminPage.getByRole('row').filter({ hasText: produto.nome });
    await expect(linha).toHaveCount(1);
    await expect(linha).toContainText(produto.preco);
    await expect(linha).toContainText(produto.descricao);
    await expect(linha).toContainText(produto.quantidade);
  });
});
