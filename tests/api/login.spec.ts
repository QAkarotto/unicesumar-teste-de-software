import { test, expect } from '../fixtures/api.fixture';
import { prepararUsuario } from '../helpers/auth';
import { novoProduto } from '../data/factories';

test.describe('Login - /login', () => {
  test('CT01 - deve autenticar usuário válido e retornar token Bearer', async ({ api }) => {
    const usuario = await prepararUsuario(api);

    const response = await api.login({ email: usuario.email, password: usuario.password });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('Login realizado com sucesso');
    expect(body.authorization).toMatch(/^Bearer [\w-]+\.[\w-]+\.[\w-]+$/); // JWT
  });

  // Mesmo comportamento esperado para duas formas de credencial inválida.
  const credenciaisInvalidas = [
    {
      id: 'CT02',
      caso: 'senha incorreta',
      montar: (u: { email: string }) => ({ email: u.email, password: 'SenhaErrada!123' }),
    },
    {
      id: 'CT03',
      caso: 'e-mail não cadastrado',
      montar: (u: { password: string }) => ({ email: 'nao.cadastrado.qa@qa-playwright.com', password: u.password }),
    },
  ];

  for (const { id, caso, montar } of credenciaisInvalidas) {
    test(`${id} - não deve autenticar com ${caso}`, async ({ api }) => {
      const usuario = await prepararUsuario(api);

      const response = await api.login(montar(usuario));

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toEqual({ message: 'Email e/ou senha inválidos' });
      expect(body).not.toHaveProperty('authorization');
    });
  }

  test('CT04 - token obtido no login deve liberar uma operação protegida', async ({ api, admin }) => {
    // admin = fixture que já cadastrou o usuário, fez login e guardou o token
    const produto = novoProduto();

    const comToken = await api.cadastrarProduto(produto, admin.token);
    expect(comToken.status()).toBe(201);
    expect((await comToken.json()).message).toBe('Cadastro realizado com sucesso');

    const tokenAdulterado = await api.cadastrarProduto(novoProduto(), `${admin.token}x`);
    expect(tokenAdulterado.status()).toBe(401);
    expect((await tokenAdulterado.json()).message).toBe(
      'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
    );
  });
});
