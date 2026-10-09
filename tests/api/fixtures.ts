import { randomUUID } from 'node:crypto';
import { test as base, expect } from '@playwright/test';

type UserData = {
  nome: string;
  email: string;
  password: string;
  administrador: string;
};
type User = UserData & { _id: string };

export function newUser(): UserData {
  return {
    nome: 'Aluno Playwright',
    email: `playwright-${randomUUID()}@example.com`,
    password: 'SenhaTeste123',
    administrador: 'false',
  };
}

export const test = base.extend<{ createUser: (data?: UserData) => Promise<User> }>({
  createUser: async ({ request }, use) => {
    const ids: string[] = [];
    await use(async (data = newUser()) => {
      const response = await request.post('/usuarios', { data });
      const body = await response.json();
      if (response.status() === 201 && typeof body._id === 'string') ids.push(body._id);
      expect(response.status()).toBe(201);
      expect(body).toEqual({ message: 'Cadastro realizado com sucesso', _id: expect.any(String) });
      expect(body._id).not.toBe('');
      return { ...data, _id: body._id };
    });
    for (const id of ids) {
      const response = await request.delete(`/usuarios/${id}`);
      expect(response.status(), `Limpeza do usuário ${id}`).toBe(200);
      expect(await response.json()).toHaveProperty('message');
    }
  },
});

export { expect };
