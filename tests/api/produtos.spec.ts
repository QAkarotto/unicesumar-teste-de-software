import { expect, test } from '@playwright/test';
import {
  cadastrarUsuario,
  excluirUsuario,
  gerarProduto,
  gerarUsuario,
  obterToken,
} from './helpers';

test.describe('API ServeRest - Produtos', () => {
  test('não deve cadastrar produto sem token de autenticação', async ({ request }) => {
    const response = await request.post('/produtos', { data: gerarProduto() });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.message).toBe(
      'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
    );
  });

  test('não deve permitir que usuário não administrador cadastre produto', async ({ request }) => {
    const usuario = gerarUsuario(false);
    const idUsuario = await cadastrarUsuario(request, usuario);

    try {
      const token = await obterToken(request, usuario.email, usuario.password);

      // Regra de negócio: apenas administradores podem cadastrar produtos
      const response = await request.post('/produtos', {
        data: gerarProduto(),
        headers: { Authorization: token },
      });

      expect(response.status()).toBe(403);

      const body = await response.json();
      expect(body.message).toBe('Rota exclusiva para administradores');
      expect(body._id).toBeUndefined();
    } finally {
      await excluirUsuario(request, idUsuario);
    }
  });
});
