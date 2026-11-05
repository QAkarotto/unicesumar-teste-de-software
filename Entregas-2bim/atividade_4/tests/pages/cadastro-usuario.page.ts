import { Locator, Page } from '@playwright/test';
import { Usuario } from '../support/factories';

/** Tela pública de cadastro de usuário (/cadastrarusuarios). */
export class CadastroUsuarioPage {
  readonly nome: Locator;
  readonly email: Locator;
  readonly senha: Locator;
  readonly administrador: Locator;
  readonly botaoCadastrar: Locator;
  readonly mensagemDeSucesso: Locator;

  constructor(private readonly page: Page) {
    this.nome = page.getByTestId('nome');
    this.email = page.getByTestId('email');
    this.senha = page.getByTestId('password');
    this.administrador = page.getByTestId('checkbox');
    this.botaoCadastrar = page.getByTestId('cadastrar');
    // O alerta de sucesso do front não tem data-testid; o texto é a mensagem devolvida pela API.
    this.mensagemDeSucesso = page.getByText('Cadastro realizado com sucesso', { exact: true });
  }

  async abrir() {
    await this.page.goto('/cadastrarusuarios');
  }

  async cadastrar(usuario: Usuario) {
    await this.nome.fill(usuario.nome);
    await this.email.fill(usuario.email);
    await this.senha.fill(usuario.password);
    await this.administrador.setChecked(usuario.administrador === 'true');
    await this.botaoCadastrar.click();
  }
}
