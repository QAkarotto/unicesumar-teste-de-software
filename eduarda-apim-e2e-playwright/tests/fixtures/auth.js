const base = require('@playwright/test');
const { API_URL, gerarUsuario } = require('../support/dados');
const { fazerLogin } = require('../support/paginas');

/**
 * Fixture personalizada:
 *  - `admin`: administrador criado via API (pré-condição), com e-mail único.
 *  - `adminPage`: página já autenticada como esse administrador.
 * Ao final, o usuário criado é removido para manter os testes independentes.
 */
const test = base.test.extend({
  admin: async ({ request }, use) => {
    const admin = gerarUsuario({ administrador: true });
    const resposta = await request.post(`${API_URL}/usuarios`, {
      data: {
        nome: admin.nome,
        email: admin.email,
        password: admin.password,
        administrador: 'true',
      },
    });
    base.expect(resposta.status(), 'criação do admin via API').toBe(201);
    const { _id } = await resposta.json();

    await use({ ...admin, _id });

    await request.delete(`${API_URL}/usuarios/${_id}`);
  },

  adminPage: async ({ page, admin }, use) => {
    await fazerLogin(page, admin);
    await base.expect(page).toHaveURL(/\/admin\/home/);
    await use(page);
  },
});

module.exports = { test, expect: base.expect };
