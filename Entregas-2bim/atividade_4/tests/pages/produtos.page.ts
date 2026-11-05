import { Locator, Page } from '@playwright/test';
import { Produto } from '../support/factories';

/** Tela de cadastro de produtos do administrador (/admin/cadastrarprodutos). */
export class CadastroProdutoPage {
  readonly titulo: Locator;
  readonly nome: Locator;
  readonly preco: Locator;
  readonly descricao: Locator;
  readonly quantidade: Locator;
  readonly botaoCadastrar: Locator;

  constructor(page: Page) {
    this.titulo = page.getByRole('heading', { name: 'Cadastro de Produtos' });
    this.nome = page.getByTestId('nome');
    this.preco = page.getByTestId('preco');
    this.descricao = page.getByTestId('descricao');
    this.quantidade = page.getByTestId('quantity');
    // "cadastarProdutos" (sem o "r") é o data-testid real do botão no front do ServeRest.
    this.botaoCadastrar = page.getByTestId('cadastarProdutos');
  }

  async preencher(produto: Produto) {
    await this.nome.fill(produto.nome);
    await this.preco.fill(String(produto.preco));
    await this.descricao.fill(produto.descricao);
    await this.quantidade.fill(String(produto.quantidade));
  }

  async enviar() {
    await this.botaoCadastrar.click();
  }
}

/** Listagem de produtos do administrador (/admin/listarprodutos). */
export class ListaProdutosPage {
  readonly titulo: Locator;

  constructor(private readonly page: Page) {
    this.titulo = page.getByRole('heading', { name: 'Lista dos Produtos' });
  }

  /**
   * Linha da tabela cujo nome é exatamente o informado. A tabela do front não tem data-testid,
   * então o seletor usa papéis de acessibilidade (row/cell), que também são estáveis.
   */
  linhaDoProduto(nome: string): Locator {
    return this.page.getByRole('row').filter({ has: this.page.getByRole('cell', { name: nome, exact: true }) });
  }

  /** Células da linha na ordem das colunas: Nome, Preço, Descrição, Quantidade, Imagem, Ações. */
  colunas(linha: Locator) {
    const celulas = linha.getByRole('cell');
    return {
      nome: celulas.nth(0),
      preco: celulas.nth(1),
      descricao: celulas.nth(2),
      quantidade: celulas.nth(3),
    };
  }
}
