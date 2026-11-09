import test, { expect } from "@playwright/test";
import { PaginaCadastro } from "./pages/PaginaCadastro";
import { PaginaLogin } from "./pages/PaginaLogin";

test.describe("Verifica página", () => {
    test("Deve verificar se existem os atributos da página", async ({ page }) => {
        await page.goto("https://front.serverest.dev/cadastrarusuarios");
        await expect(page).toHaveTitle("Front - ServeRest");
    });
});

test.describe("Cadastra pessoa comum", () => {
    test("Deve cadastrar usuário", async ({ page }) => {
        const senha = "alexs123";
        const nome = "Jão";
        const email = `alexs${Date.now()}@gmail.com`;

        const paginaCadastro = new PaginaCadastro(page);
        const paginaLogin = new PaginaLogin(page);

        await paginaCadastro.visitarCadastro();
        await paginaCadastro.clicarEmCadastrar(nome, email, senha);
        await expect(
            page.getByText("Cadastro realizado com sucesso"),
        ).toBeVisible();

        await expect(page).toHaveURL("https://front.serverest.dev/home");

        await paginaCadastro.clicarEmSair();

        await paginaLogin.fazerLogin(email, senha);

        await expect(page).toHaveURL("https://front.serverest.dev/home");
    });
});
