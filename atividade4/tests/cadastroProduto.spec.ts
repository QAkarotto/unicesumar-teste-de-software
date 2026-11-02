import { expect } from '@playwright/test';
import {test} from '../contaAdmin.fixture';

test('deve cadastrar produto', async ({fixturePage}) => {
  const nomeProduto = `Produto Teste ${Date.now()}`;
  const precoProduto = '100';
  const descricaoProduto = 'Descrição do produto de teste';
  const quantidadeProduto = '10';

  await fixturePage.getByTestId('cadastrarProdutos').click();
  await fixturePage.getByTestId('nome').fill(nomeProduto);
  await fixturePage.getByTestId('preco').fill(precoProduto);
  await fixturePage.getByTestId('descricao').fill(descricaoProduto);
  await fixturePage.getByTestId('quantity').fill(quantidadeProduto);


  await fixturePage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await fixturePage.getByTestId('cadastarProdutos').click();
  await expect(fixturePage.getByText(nomeProduto)).toBeVisible();

})
