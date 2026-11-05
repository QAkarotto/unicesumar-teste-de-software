import { test, expect } from './fixtures/admin.fixture';

test('administrador deve cadastrar e visualizar um produto', async ({
  adminPage,
}) => {
  const id = `${Date.now()}`;

  const produto = {
    nome: `Produto E2E ${id}`,
    preco: '150',
    descricao: `Produto criado pelo teste automatizado ${id}`,
    quantidade: '10',
  };

  // Acessa o cadastro de produtos pela interface.
  await adminPage.getByTestId('cadastrar-produtos').click();

  // Preenche os campos do produto.
  await adminPage.getByPlaceholder('Digite o nome do produto').fill(produto.nome);
  await adminPage.getByLabel('Preço: *').fill(produto.preco);
  await adminPage.getByPlaceholder('Digite a descrição do produto').fill(produto.descricao);
  await adminPage.getByLabel('Quantidade: *').fill(produto.quantidade);

  // Salva o produto.
  await adminPage.getByRole('button', { name: /cadastrar/i }).click();

  // Acessa a listagem pela interface.
  await adminPage
    .getByText(/listar produtos/i)
    .click();

  // Confirma que o produto aparece na listagem.
  await expect(
    adminPage.getByText(produto.nome, { exact: true })
  ).toBeVisible();
});