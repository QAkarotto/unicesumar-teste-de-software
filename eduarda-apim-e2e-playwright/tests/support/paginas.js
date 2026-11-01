/** Ações de UI reutilizáveis (separadas da preparação e das asserções). */

async function fazerLogin(page, { email, password }) {
  await page.goto('/login');
  await page.getByTestId('email').fill(email);
  await page.getByTestId('senha').fill(password);
  await page.getByTestId('entrar').click();
}

async function cadastrarUsuarioPelaUI(page, { nome, email, password, administrador }) {
  await page.goto('/cadastrarusuarios');
  await page.getByTestId('nome').fill(nome);
  await page.getByTestId('email').fill(email);
  await page.getByTestId('password').fill(password);
  if (administrador) {
    await page.getByTestId('checkbox').check();
  }
  await page.getByTestId('cadastrar').click();
}

async function cadastrarProdutoPelaUI(page, produto) {
  await page.goto('/admin/cadastrarprodutos');
  await page.getByTestId('nome').fill(produto.nome);
  await page.getByTestId('preco').fill(produto.preco);
  await page.getByTestId('descricao').fill(produto.descricao);
  await page.getByTestId('quantity').fill(produto.quantidade);
  // O data-testid do botão no ServeRest Front é "cadastarProdutos" (sem o "r").
  await page.getByTestId('cadastarProdutos').click();
}

module.exports = { fazerLogin, cadastrarUsuarioPelaUI, cadastrarProdutoPelaUI };
