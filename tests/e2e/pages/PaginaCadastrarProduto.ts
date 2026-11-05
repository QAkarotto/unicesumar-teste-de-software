import { Page } from "@playwright/test";


export class PaginaCadastrarProduto{
    private readonly page: Page;
    private readonly buttonClicarCadastrar: import("@playwright/test").Locator;
    inputPrecoProduto: import("@playwright/test").Locator;
    inputQuantidade: import("@playwright/test").Locator;
    inputNomeProduto: import("@playwright/test").Locator;
    inputDescricao: import("@playwright/test").Locator;
    buttonCadastrar: import("@playwright/test").Locator;

    
    constructor(page: Page){

        this.page = page;
        this.buttonClicarCadastrar = page.getByTestId('cadastrar-produtos');
        this.inputNomeProduto = page.getByTestId('nome');
        this.inputPrecoProduto = page.getByTestId('preco');
        this.inputDescricao = page.getByTestId('descricao');
        this.inputQuantidade = page.getByTestId('quantity');
        this.buttonCadastrar = page.getByTestId('cadastarProdutos');
    }


    async clicarCadastrar(){
        await this.buttonClicarCadastrar.click();
    }

    async cadastrarProduto(nome:string, preco:number, descricao: string, quantity:number){
        await this.inputNomeProduto.fill(nome);
        await this.inputPrecoProduto.fill(String(preco));
        await this.inputDescricao.fill(descricao);
        await this.inputQuantidade.fill(String(quantity));
    }

    async clicarNoBotaoCadastrar(){
        await this.buttonCadastrar.click();
    }
}