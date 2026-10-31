
import { test, expect } from '../fixtures/admin.fixture';

test('deve cadastrar e listar um produto como administrador', async ({ adminPage }) => {
  const nome = `Produto Sevs ${Date.now()}`;
  const preco = '150';
  const descricao = 'Produto de teste E2E';
  const quantidade = '10';

  await adminPage.getByTestId('cadastrar-produtos').click();

  await adminPage.getByTestId('nome').fill(nome);
  await adminPage.getByTestId('preco').fill(preco);
  await adminPage.getByTestId('descricao').fill(descricao);
  await adminPage.getByTestId('quantity').fill(quantidade);
  await adminPage.getByTestId('imagem').setInputFiles('produto.png');

  await adminPage.getByRole('button', { name: 'Cadastrar', exact: true }).click();

  const produto = adminPage.getByRole('row').filter({ hasText: nome });

  await expect(produto).toBeVisible();
  await expect(produto).toContainText(preco);
  await expect(produto).toContainText(descricao);
  await expect(produto).toContainText(quantidade);
});
