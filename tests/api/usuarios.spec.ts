import { test, expect } from '../fixtures/api.fixture';
import { criarUsuarioDto } from '../data/factories';
import { cadastrarUsuario, excluirUsuario } from '../helpers/api';

test.describe('Usuários', () => {
  test('cadastra usuário com dados dinâmicos e persiste os dados', async ({ request }) => {
    const usuario = criarUsuarioDto();

    const resposta = await request.post('/usuarios', { data: usuario });
    expect(resposta.status()).toBe(201);
    const corpo = await resposta.json();
    expect(corpo.message).toBe('Cadastro realizado com sucesso');
    expect(corpo._id).toBeTruthy();

    try {
      const consulta = await request.get(`/usuarios/${corpo._id}`);
      expect(consulta.status()).toBe(200);
      expect(await consulta.json()).toMatchObject({ ...usuario, _id: corpo._id });
    } finally {
      await excluirUsuario(request, corpo._id);
    }
  });

  test('não cadastra usuário com e-mail inválido', async ({ request }) => {
    const usuario = { ...criarUsuarioDto(), email: 'email-sem-arroba' };

    const resposta = await request.post('/usuarios', { data: usuario });

    expect(resposta.status()).toBe(400);
    const corpo = await resposta.json();
    expect(corpo.email).toBe('email deve ser um email válido');
    expect(corpo).not.toHaveProperty('_id');
  });

  test('regra de negócio: não permite e-mail já utilizado', async ({ request }) => {
    const { usuario, id } = await cadastrarUsuario(request);

    try {
      const duplicado = await request.post('/usuarios', {
        data: { ...criarUsuarioDto(), email: usuario.email },
      });

      expect(duplicado.status()).toBe(400);
      expect((await duplicado.json()).message).toBe('Este email já está sendo usado');
    } finally {
      await excluirUsuario(request, id);
    }
  });
});
