import { expect, Page } from "@playwright/test";

export class PaginaLogin{
    private readonly page: Page;
    private readonly botaoLogin: import("@playwright/test").Locator;
    private readonly inputEmail: import("@playwright/test").Locator;
    private readonly inputSenha: import("@playwright/test").Locator;

    constructor(page: Page){
        this.page = page;
        this.botaoLogin = page.getByTestId('entrar');
        this.inputEmail = page.getByTestId('email');
        this.inputSenha = page.getByTestId('senha')
    }

    async visitar(){
        await this.page.goto("https://front.serverest.dev/");
    }

    async fazerLogin(email: string, senha: string){
        await this.inputEmail.fill(email);
        await this.inputSenha.fill(senha);
        await this.botaoLogin.click();
    }

    async estaMostrandoMensagemDeErro(mensagem: string){
        const elementoErro = this.page.getByText(mensagem);
        await expect(elementoErro).toBeVisible();
    }
}