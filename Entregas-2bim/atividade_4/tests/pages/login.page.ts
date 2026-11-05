import { Locator, Page } from '@playwright/test';

/** Tela de login (/login). */
export class LoginPage {
  readonly email: Locator;
  readonly senha: Locator;
  readonly botaoEntrar: Locator;
  readonly linkCadastrar: Locator;
  /** Alerta de erro exibido pelo front (componente ErrorAlert, role="alert"; não tem data-testid). */
  readonly alertaDeErro: Locator;

  constructor(private readonly page: Page) {
    this.email = page.getByTestId('email');
    this.senha = page.getByTestId('senha');
    this.botaoEntrar = page.getByTestId('entrar');
    this.linkCadastrar = page.getByTestId('cadastrar');
    this.alertaDeErro = page.getByRole('alert');
  }

  async abrir() {
    await this.page.goto('/login');
  }

  async autenticar(email: string, senha: string) {
    await this.email.fill(email);
    await this.senha.fill(senha);
    await this.botaoEntrar.click();
  }
}
