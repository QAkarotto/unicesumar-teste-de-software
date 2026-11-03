import { faker } from '@faker-js/faker';
import { expect, test } from '../fixtures/admin.fixture';

const frontUrl = process.env.SERVEREST_FRONT_URL ?? 'https://front.serverest.dev';

test('administrador cadastra produto e confirma os dados na listagem', async ({ adminPage, request }) => {
  const produto = {
    nome: `E2E ${faker.commerce.productName()} ${faker.string.alphanumeric(8)}`,
    preco: faker.number.int({ min: 10, max: 500 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 1, max: 100 }),
  };
  let idProduto: string | undefined;

  try {
    // Preparação da ação: fixture já abriu uma página autenticada como administrador.
    await adminPage.getByTestId('cadastrarProdutos').click();
    await expect(adminPage).toHaveURL(/\/admin\/cadastrarprodutos$/);

    // Ação principal do cenário: preencher e enviar o formulário pela interface.
    const respostaCadastro = adminPage.waitForResponse((response) =>
      response.url().includes('/produtos') && response.request().method() === 'POST',
    );
    await adminPage.getByTestId('nome').fill(produto.nome);
    await adminPage.getByTestId('preco').fill(String(produto.preco));
    await adminPage.getByTestId('descricao').fill(produto.descricao);
    await adminPage.getByTestId('quantity').fill(String(produto.quantidade));
    await adminPage.getByTestId('cadastarProdutos').click();

    const resposta = await respostaCadastro;
    expect(resposta.ok(), 'A interface deve concluir o cadastro do produto').toBeTruthy();
    const corpo = await resposta.json();
    idProduto = corpo._id;

    // Resultado esperado: a interface redireciona para a lista e exibe todos os dados.
    await adminPage.waitForURL('**/admin/listarprodutos');
    await expect(adminPage.getByRole('heading', { name: 'Lista dos Produtos' })).toBeVisible();
    const linhaProduto = adminPage.getByRole('row').filter({ hasText: produto.nome });
    await expect(linhaProduto).toBeVisible();
    await expect(linhaProduto.getByRole('cell').nth(0)).toHaveText(produto.nome);
    await expect(linhaProduto.getByRole('cell').nth(1)).toHaveText(String(produto.preco));
    await expect(linhaProduto.getByRole('cell').nth(2)).toHaveText(produto.descricao);
    await expect(linhaProduto.getByRole('cell').nth(3)).toHaveText(String(produto.quantidade));
  } finally {
    // Limpeza da massa criada pela interface, para manter o ambiente compartilhado organizado.
    if (idProduto) {
      const token = await adminPage.evaluate(() => localStorage.getItem('serverest/userToken'));
      if (token) {
        await request.delete(`/produtos/${idProduto}`, { headers: { Authorization: token } });
      }
    }
  }
});
