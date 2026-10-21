import { expect, type APIRequestContext } from '@playwright/test';
import { criarProduto, criarUsuario } from '../data/factories';

export type Limpeza = () => Promise<void>;

// O ID é registrado antes das verificações para limpar mesmo se uma asserção falhar.
export async function cadastrarUsuario(request: APIRequestContext, limpezas: Limpeza[]) {
  const dados = criarUsuario();
  const response = await request.post('/usuarios', { data: dados });
  const body = await response.json();
  if (response.status() === 201 && body._id) {
    limpezas.push(async () => {
      const exclusao = await request.delete(`/usuarios/${body._id}`);
      expect(exclusao.status()).toBe(200);
      expect((await exclusao.json()).message).toBe('Registro excluído com sucesso');
    });
  }
  expect(response.status()).toBe(201);
  expect(body.message).toBe('Cadastro realizado com sucesso');
  expect(body._id).toEqual(expect.any(String));
  return { ...dados, _id: body._id as string };
}

export async function cadastrarProduto(
  request: APIRequestContext, token: string, limpezas: Limpeza[],
) {
  const dados = criarProduto();
  const headers = { Authorization: token };
  const response = await request.post('/produtos', { data: dados, headers });
  const body = await response.json();
  if (response.status() === 201 && body._id) {
    limpezas.push(async () => {
      const exclusao = await request.delete(`/produtos/${body._id}`, { headers });
      expect(exclusao.status()).toBe(200);
      expect((await exclusao.json()).message).toBe('Registro excluído com sucesso');
    });
  }
  expect(response.status()).toBe(201);
  expect(body.message).toBe('Cadastro realizado com sucesso');
  expect(body._id).toEqual(expect.any(String));
  return { ...dados, _id: body._id as string };
}
