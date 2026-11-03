import test, { expect } from "@playwright/test";
import { PaginaLogin } from "./pages/PaginaLogin";

test.describe("Pagina inicial", () =>{
    test("Deve visitar a pagina inicial e validar atributos", async ({ page }) =>{
        await page.goto("https://front.serverest.dev/login");
        await expect(page).toHaveTitle("Front - ServeRest");

        const titulo = page.getByRole('heading', {name: 'Login'})
        await expect(titulo).toBeVisible();
        
        const emailTeste = page.getByTestId('email')
        await expect(emailTeste).toBeVisible();
        
        const senhaTeste = page.getByTestId('senha')
        await expect(senhaTeste).toBeVisible();
    });
});

// await expect(page.getByText('Email e/ou senha inválidos')).toBeVisible();

test.describe("Fazendo o login", () => {
    test("Não deve fazer o login com crecedências inválidas", async ({page}) => {
        const paginaLogin = new PaginaLogin(page);
        await paginaLogin.visitar();
        await paginaLogin.fazerLogin('teste@gmail.com', 'paogames');
        await paginaLogin.estaMostrandoMensagemDeErro('Email e/ou senha inválidos');
    });
});



