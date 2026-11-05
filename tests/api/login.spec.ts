import { test, expect } from '../fixtures/api.fixture';
import { cadastrarUsuario, excluirUsuario } from '../helpers/api';

test.describe('Login', () => {
  test('autentica com dados válidos e retorna token Bearer', async ({ request }) => {
    const { usuario, id } = await cadastrarUsuario(request);

    try {
      const resposta = await request.post('/login', {
        data: { email: usuario.email, password: usuario.password },
      });

      expect(resposta.status()).toBe(200);
      const corpo = await resposta.json();
      expect(corpo.message).toBe('Login realizado com sucesso');
      expect(corpo.authorization).toMatch(/^Bearer \S+$/);
    } finally {
      await excluirUsuario(request, id);
    }
  });

  test('não autentica com senha incorreta', async ({ request }) => {
    const { usuario, id } = await cadastrarUsuario(request);

    try {
      const resposta = await request.post('/login', {
        data: { email: usuario.email, password: `${usuario.password}-errada` },
      });

      expect(resposta.status()).toBe(401);
      const corpo = await resposta.json();
      expect(corpo.message).toBe('Email e/ou senha inválidos');
      expect(corpo).not.toHaveProperty('authorization');
    } finally {
      await excluirUsuario(request, id);
    }
  });
});
