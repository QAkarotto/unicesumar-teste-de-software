const { test, expect } = require('./fixtures/admin.fixture');

test('deve permitir que o administrador cadastre um produto', async ({ adminPage }) => {
  const produto = {
    nome: `Produto E2E ${Date.now()}`,
    preco: '150',
    descricao: 'Produto criado pelo teste E2E',
    quantidade: '10'
  };

  // Abre a página de cadastro de produtos
  await adminPage.goto('/admin/cadastrarprodutos');

  // Localiza os campos e preenche as informações
  const inputs = adminPage.locator('input');

  await inputs.nth(0).fill(produto.nome);
  await inputs.nth(1).fill(produto.preco);
  await adminPage.locator('textarea').fill(produto.descricao);
  await inputs.nth(2).fill(produto.quantidade);

  // Confirma o cadastro do produto
  const botaoCadastrar = adminPage.getByRole('button', {
    name: /cadastrar/i
  });

  await botaoCadastrar.click();

  // Consulta a relação de produtos cadastrados
  await adminPage.goto('/admin/listarprodutos');

  // Verifica se o produto recém-criado aparece na listagem
  const produtoCadastrado = adminPage.getByText(produto.nome, {
    exact: true
  });

  await expect(produtoCadastrado).toBeVisible();
});