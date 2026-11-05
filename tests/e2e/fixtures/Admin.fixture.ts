import { test as base, expect,Page } from "@playwright/test";
import { PaginaCadastro } from "../pages/PaginaCadastro";
import { PaginaLogin } from "../pages/PaginaLogin";

export const test = base.extend<{paginaAdmin: Page}>({
    paginaAdmin: async ({page}, use) => {

        const paginaCadastro = new PaginaCadastro(page);

        await paginaCadastro.visitarCadastro();

        const email = `teste${Date.now()}@gmail.com`;
        const senha = '123';
        const nome = 'Teste';

        await paginaCadastro.clicarEmCadastrar(nome, email, senha, true)

        await use(page)
    },
});

export {expect}
