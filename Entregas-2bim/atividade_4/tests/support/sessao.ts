import { Page } from '@playwright/test';
import { UsuarioAutenticado } from './api';

/**
 * O front do ServeRest guarda a sessão no localStorage do navegador, com estas chaves
 * (gravadas pela própria tela de login após POST /login com sucesso).
 */
const CHAVES = {
  email: 'serverest/userEmail',
  token: 'serverest/userToken',
  nome: 'serverest/userNome',
} as const;

/** Grava no navegador a mesma sessão que a tela de login gravaria (login programático). */
export async function gravarSessao(page: Page, usuario: UsuarioAutenticado) {
  await page.evaluate(
    ({ chaves, usuario }) => {
      localStorage.setItem(chaves.email, usuario.email);
      localStorage.setItem(chaves.token, usuario.token);
      localStorage.setItem(chaves.nome, usuario.nome);
    },
    { chaves: CHAVES, usuario },
  );
}

/** Remove qualquer sessão gravada no navegador. */
export async function limparSessao(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

/** Token da sessão atual do front (null quando não há usuário autenticado). */
export function tokenDaSessao(page: Page): Promise<string | null> {
  return page.evaluate((chave) => localStorage.getItem(chave), CHAVES.token);
}
