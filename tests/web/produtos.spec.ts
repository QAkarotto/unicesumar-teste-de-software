
import { test, expect } from '../fixtures/admin.fixture';
import { produtoFactory } from '../data/factories';

test('deve cadastrar produto como administrador e validar na listagem', async ({ adminPage }) => {
  const produto = produtoFactory();

  // Acessa o formulário de cadastro.
  await adminPage.getByTestId('cadastrar-produtos').click();

  // Preenche os dados do produto.
  await adminPage.getByTestId('nome').fill(produto.nome);
  await adminPage.getByTestId('preco').fill(String(produto.preco));
  await adminPage.getByTestId('descricao').fill(produto.descricao);
  await adminPage.getByTestId('quantity').fill(String(produto.quantidade));

  // Anexa uma imagem PNG de teste.
  const imagem = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/pWQAAAAASUVORK5CYII=',
    'base64'
  );

  await adminPage.locator('input[type="file"]').setInputFiles({
    name: 'produto-teste.png',
    mimeType: 'image/png',
    buffer: imagem,
  });

  // Cadastra o produto.
  await adminPage.getByRole('button', { name: 'Cadastrar' }).click();

  // Acessa a listagem.
  await adminPage.getByTestId('listar-produtos').click();

  // Localiza a linha do produto cadastrado.
  const linhaProduto = adminPage
    .getByRole('row')
    .filter({ hasText: produto.nome });

  // Verifica os dados apresentados.
  await expect(linhaProduto).toBeVisible();
  await expect(linhaProduto).toContainText(produto.nome);
  await expect(linhaProduto).toContainText(String(produto.preco));
  await expect(linhaProduto).toContainText(produto.descricao);
  await expect(linhaProduto).toContainText(String(produto.quantidade));
});
