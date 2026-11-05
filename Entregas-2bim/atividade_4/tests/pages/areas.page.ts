import { Locator, Page } from '@playwright/test';

/** Área do administrador (/admin/home) e o menu (navbar) exibido em todas as telas de admin. */
export class AreaAdminPage {
  readonly saudacao: Locator;
  readonly menuCadastrarUsuarios: Locator;
  readonly menuListarUsuarios: Locator;
  readonly menuCadastrarProdutos: Locator;
  readonly menuListarProdutos: Locator;
  readonly menuRelatorios: Locator;
  readonly botaoLogout: Locator;

  constructor(page: Page) {
    this.saudacao = page.getByRole('heading', { level: 1 });
    this.menuCadastrarUsuarios = page.getByTestId('cadastrar-usuarios');
    this.menuListarUsuarios = page.getByTestId('listar-usuarios');
    this.menuCadastrarProdutos = page.getByTestId('cadastrar-produtos');
    this.menuListarProdutos = page.getByTestId('listar-produtos');
    this.menuRelatorios = page.getByTestId('link-relatorios');
    this.botaoLogout = page.getByTestId('logout');
  }
}

/** Área do cliente / usuário comum (/home): loja e menu de compras. */
export class AreaClientePage {
  readonly titulo: Locator;
  readonly pesquisa: Locator;
  readonly menuListaDeCompras: Locator;
  readonly menuCarrinho: Locator;
  readonly botaoLogout: Locator;

  constructor(page: Page) {
    this.titulo = page.getByRole('heading', { level: 1 });
    this.pesquisa = page.getByTestId('pesquisar');
    this.menuListaDeCompras = page.getByTestId('lista-de-compras');
    this.menuCarrinho = page.getByTestId('carrinho');
    this.botaoLogout = page.getByTestId('logout');
  }
}
