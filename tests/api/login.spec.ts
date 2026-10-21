
import { test, expect } from '@playwright/test';
import { criarUsuarioAdmin, realizarLogin } from '../helpers/auth';
import { excluirUsuario } from '../helpers/api';

test('realizar login com dados válidos', async ({ request }) => {
  const { usuario, id } = await criarUsuarioAdmin(request);

  try {
    const token = await realizarLogin(
      request,
      usuario.email,
      usuario.password
    );

    expect(token).toBeTruthy();
    expect(token).toContain('Bearer ');
  } finally {
    await excluirUsuario(request, id);
  }
});

test('impedir login com senha inválida', async ({ request }) => {
  const { usuario, id } = await criarUsuarioAdmin(request);

  try {
    const resposta = await request.post('/login', {
      data: {
        email: usuario.email,
        password: 'senha-incorreta'
      }
    });

    expect(resposta.status()).toBe(401);
    expect((await resposta.json()).message).toBe('Email e/ou senha inválidos');
  } finally {
    await excluirUsuario(request, id);
  }
});
