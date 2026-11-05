import { expect, test } from '../fixtures/e2e.fixture';
import { AreaAdminPage, AreaClientePage } from '../pages/areas.page';
import { CadastroUsuarioPage } from '../pages/cadastro-usuario.page';
import { LoginPage } from '../pages/login.page';
import { Administrador, novoUsuario } from '../support/factories';
import { limparSessao, tokenDaSessao } from '../support/sessao';

/**
 * Cenário 1 — Cadastro e autenticação de usuário.
 * O mesmo fluxo roda para os dois perfis do ServeRest, porque cada um deve cair numa área diferente.
 */
const perfis: { id: string; perfil: string; administrador: Administrador; area: string }[] = [
  { id: 'CT01', perfil: 'comum', administrador: 'false', area: '/home' },
  { id: 'CT02', perfil: 'administrador', administrador: 'true', area: '/admin/home' },
];

test.describe('Cenário 1: cadastro e autenticação de usuário', () => {
  for (const { id, perfil, administrador, area } of perfis) {
    test(`${id} - usuário ${perfil} se cadastra, faz login e acessa a área ${area}`, async ({ page, limpeza }) => {
      const usuario = novoUsuario({ administrador });
      const cadastro = new CadastroUsuarioPage(page);
      const login = new LoginPage(page);

      await test.step('Preparação: agendar a remoção do usuário e abrir a tela de cadastro', async () => {
        limpeza.removerUsuarioAoFinal(usuario.email);
        await cadastro.abrir();
      });

      await test.step('Cadastrar o usuário pela interface', async () => {
        await cadastro.cadastrar(usuario);
        await expect(cadastro.mensagemDeSucesso).toBeVisible();
      });

      await test.step('Preparação: abrir o login sem nenhuma sessão ativa', async () => {
        // Após o cadastro o front faz um login automático; a sessão é descartada para que
        // a autenticação validada seja a feita pela tela de login, com as credenciais cadastradas.
        await login.abrir();
        await limparSessao(page);
        expect(await tokenDaSessao(page)).toBeNull();
      });

      await test.step('Autenticar com as credenciais cadastradas', async () => {
        const respostaLogin = page.waitForResponse(
          (r) => r.request().method() === 'POST' && new URL(r.url()).pathname === '/login',
        );
        await login.autenticar(usuario.email, usuario.password);
        expect((await respostaLogin).status()).toBe(200);
      });

      await test.step(`Validar que o usuário ${perfil} acessou a área ${area}`, async () => {
        await expect(page).toHaveURL((url) => url.pathname === area);
        expect(await tokenDaSessao(page)).toMatch(/^Bearer .+/);

        const areaAdmin = new AreaAdminPage(page);
        const areaCliente = new AreaClientePage(page);

        if (administrador === 'true') {
          await expect(areaAdmin.saudacao).toHaveText(`Bem Vindo ${usuario.nome}`);
          await expect(areaAdmin.menuCadastrarProdutos).toBeVisible();
          await expect(areaAdmin.menuListarUsuarios).toBeVisible();
          await expect(areaCliente.menuCarrinho).toHaveCount(0);
        } else {
          await expect(areaCliente.titulo).toHaveText('Serverest Store');
          await expect(areaCliente.pesquisa).toBeVisible();
          await expect(areaCliente.menuListaDeCompras).toBeVisible();
          await expect(areaCliente.menuCarrinho).toBeVisible();
          // Usuário comum não pode ver as funções de administrador.
          await expect(areaAdmin.menuCadastrarProdutos).toHaveCount(0);
          await expect(areaAdmin.menuListarUsuarios).toHaveCount(0);
        }
      });
    });
  }
});
