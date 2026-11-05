const { test, expect } = require('../fixtures/admin.fixture');

test('administrador deve cadastrar e visualizar um produto', async ({ adminPage }) => {
  const identificador = Date.now();

  const produto = {
    nome: `Produto Teste ${identificador}`,
    preco: '25',
    descricao: 'Produto cadastrado automaticamente pelo Playwright.',
    quantidade: '10'
  };

  await adminPage.getByText('Cadastrar Produtos').first().click();

  await expect(adminPage).toHaveURL(/\/admin\/cadastrarprodutos/);

  await adminPage.getByTestId('nome').fill(produto.nome);
  await adminPage.getByTestId('preco').fill(produto.preco);
  await adminPage.getByTestId('descricao').fill(produto.descricao);
  await adminPage.getByTestId('quantity').fill(produto.quantidade);

  const imagem = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=',
    'base64'
  );

  await adminPage.getByTestId('imagem').setInputFiles({
    name: 'produto-teste.png',
    mimeType: 'image/png',
    buffer: imagem
  });

  const respostaCadastro = adminPage.waitForResponse(resposta =>
    resposta.url().includes('/produtos') &&
    resposta.request().method() === 'POST'
  );

  await adminPage.getByRole('button', { name: 'Cadastrar' }).click();

  const resposta = await respostaCadastro;

  expect(resposta.status()).toBe(201);

  await adminPage.getByText('Listar Produtos').first().click();

  const linhaProduto = adminPage
  .getByRole('row')
  .filter({ hasText: produto.nome });

await expect(linhaProduto).toBeVisible();
await expect(linhaProduto).toContainText(produto.preco);
await expect(linhaProduto).toContainText(produto.quantidade);

  console.log('Produto cadastrado:', produto.nome);
  console.log('Status do cadastro:', resposta.status());
});