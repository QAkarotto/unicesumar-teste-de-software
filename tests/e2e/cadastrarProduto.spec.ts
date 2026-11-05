import { test, expect} from "./fixtures/Admin.fixture";
import { PaginaCadastrarProduto } from "./pages/PaginaCadastrarProduto";


test.describe('Cadastrar produto', () =>  {
    test('Cadastrar produto como adminstrador e verificar se foi cadastrado', async ({ paginaAdmin }) => {

        const paginaCadastrarProduto = new PaginaCadastrarProduto(paginaAdmin);
        const produto = `Pao${Date.now()}`;
        const preco = 23;
        const descricao = 'Pao de forma';
        const quantity = 54;
        
        
        await paginaCadastrarProduto.clicarCadastrar();

        await expect(paginaAdmin).toHaveURL('https://front.serverest.dev/admin/cadastrarprodutos');

        await paginaCadastrarProduto.cadastrarProduto(produto, preco, descricao, quantity);

        await paginaCadastrarProduto.clicarNoBotaoCadastrar();

        await expect(paginaAdmin.getByText(produto, {exact: true})).toBeVisible();

    });
})