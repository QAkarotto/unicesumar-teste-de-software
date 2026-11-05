import { expect, test } from '../fixtures/e2e.fixture';
import { AreaAdminPage } from '../pages/areas.page';
import { CadastroProdutoPage, ListaProdutosPage } from '../pages/produtos.page';
import { novoProduto } from '../support/factories';

/**
 * Cenário 2 — Cadastro de produto pelo administrador.
 * A fixture `adminPage` entrega o navegador já autenticado como um administrador novo;
 * o teste só executa o comportamento: cadastrar o produto e conferi-lo na listagem.
 */
test.describe('Cenário 2: cadastro de produto pelo administrador', () => {
  test('CT03 - administrador cadastra um produto e o encontra na listagem com os dados informados', async ({
    adminPage,
    admin,
    limpeza,
  }) => {
    const produto = novoProduto();
    const areaAdmin = new AreaAdminPage(adminPage);
    const cadastro = new CadastroProdutoPage(adminPage);
    const listagem = new ListaProdutosPage(adminPage);

    await test.step('Preparação: agendar a remoção do produto', async () => {
      limpeza.removerProdutoAoFinal(produto.nome, admin.token);
    });

    await test.step('Abrir o cadastro de produtos pelo menu', async () => {
      await areaAdmin.menuCadastrarProdutos.click();
      await expect(adminPage).toHaveURL((url) => url.pathname === '/admin/cadastrarprodutos');
      await expect(cadastro.titulo).toBeVisible();
    });

    await test.step('Cadastrar o produto pela interface', async () => {
      const respostaCadastro = adminPage.waitForResponse(
        (r) => r.request().method() === 'POST' && new URL(r.url()).pathname === '/produtos',
      );
      await cadastro.preencher(produto);
      await test.info().attach('formulario-preenchido', { body: await adminPage.screenshot(), contentType: 'image/png' });
      await cadastro.enviar();
      expect((await respostaCadastro).status()).toBe(201);
    });

    await test.step('Acessar a listagem de produtos', async () => {
      // Após cadastrar, o front leva o administrador para a listagem, que é carregada da API.
      await expect(adminPage).toHaveURL((url) => url.pathname === '/admin/listarprodutos');
      await expect(listagem.titulo).toBeVisible();
    });

    await test.step('Verificar que o produto está na listagem com os dados esperados', async () => {
      const linha = listagem.linhaDoProduto(produto.nome);
      await expect(linha).toHaveCount(1);

      const colunas = listagem.colunas(linha);
      await expect(colunas.nome).toHaveText(produto.nome);
      await expect(colunas.preco).toHaveText(String(produto.preco));
      await expect(colunas.descricao).toHaveText(produto.descricao);
      await expect(colunas.quantidade).toHaveText(String(produto.quantidade));
    });
  });
});
