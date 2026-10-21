import { APIRequestContext, expect } from '@playwright/test';
import { makeUser, makeProduct, UserData, ProductData } from '../data/factories';

export async function createUser(request: APIRequestContext, data: UserData = makeUser()) {
  const response = await request.post('/usuarios', { data });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.message).toBe('Cadastro realizado com sucesso');
  expect(body._id).toBeTruthy();
  return { id: body._id as string, data };
}
export async function deleteUser(request: APIRequestContext, id: string) {
  const response = await request.delete(`/usuarios/${id}`);
  expect([200, 400]).toContain(response.status());
}
export async function createProduct(request: APIRequestContext, token: string, data: ProductData = makeProduct()) {
  const response = await request.post('/produtos', { data, headers: { Authorization: token } });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.message).toBe('Cadastro realizado com sucesso');
  expect(body._id).toBeTruthy();
  return { id: body._id as string, data };
}
export async function deleteProduct(request: APIRequestContext, token: string, id: string) {
  const response = await request.delete(`/produtos/${id}`, { headers: { Authorization: token } });
  expect([200, 400]).toContain(response.status());
}
