import { Page } from "@playwright/test";

export class PaginaCadastro {
    private readonly page: Page;
    private readonly campoSelecaoAdministrador: import("@playwright/test").Locator;
    private readonly inputNome: import("@playwright/test").Locator;
    private readonly inputEmail: import("@playwright/test").Locator;
    private readonly inputSenha: import("@playwright/test").Locator;
    private readonly buttonCadastrar: import("@playwright/test").Locator;
    private readonly buttonSair: import("@playwright/test").Locator;
    
    constructor(page: Page){
        this.page = page;

        this.inputNome = page.getByTestId('nome');
        this.inputEmail = page.getByTestId('email');
        this.inputSenha = page.getByTestId('password');
        this.campoSelecaoAdministrador = page.getByTestId('checkbox');
        this.buttonCadastrar = page.getByTestId('cadastrar');
        this.buttonSair = page.getByTestId('logout');
    }

    async visitarCadastro(){
        await this.page.goto("https://front.serverest.dev/cadastrarusuarios");
    }

    async clicarEmCadastrar(nome: string, email: string, senha:string, administrador = false){
        await this.inputNome.fill(nome);
        await this.inputEmail.fill(email);
        await this.inputSenha.fill(senha);

        if(administrador){
            await this.campoSelecaoAdministrador.check();
        }
        await this.buttonCadastrar.click();
    }

    async clicarEmSair(){
        await this.buttonSair.click();
    }
}