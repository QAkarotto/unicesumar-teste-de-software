import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { novoUsuario, Usuario } from './factories';

export type UsuarioCadastrado = Usuario & { _id: string };
export type UsuarioAutenticado = UsuarioCadastrado & { token: string };

/**
 * Cliente mínimo da API do ServeRest, usado SOMENTE para preparar pré-condições
 * e limpar a massa de dados. As ações testadas acontecem pela interface web.
 */
export class ServeRestApi {
  constructor(private readonly request: APIRequestContext) {}

  cadastrarUsuario(usuario: Usuario) {
    return this.request.post('/usuarios', { data: usuario });
  }

  login(email: string, password: string) {
    return this.request.post('/login', { data: { email, password } });
  }

  async buscarIdsDeUsuarios(email: string): Promise<string[]> {
    const response = await this.request.get('/usuarios', { params: { email } });
    const usuarios: { _id: string; email: string }[] = (await response.json()).usuarios ?? [];
    return usuarios.filter((u) => u.email === email).map((u) => u._id);
  }

  async buscarIdsDeProdutos(nome: string): Promise<string[]> {
    // No ServeRest o filtro por nome é parcial e ignora maiúsculas; por isso o nome exato é conferido aqui.
    const response = await this.request.get('/produtos', { params: { nome } });
    const produtos: { _id: string; nome: string }[] = (await response.json()).produtos ?? [];
    return produtos.filter((p) => p.nome === nome).map((p) => p._id);
  }

  excluirUsuario(id: string) {
    return this.request.delete(`/usuarios/${id}`);
  }

  excluirProduto(id: string, token: string) {
    return this.request.delete(`/produtos/${id}`, { headers: { Authorization: token } });
  }
}

/** Cadastra um usuário pela API (pré-condição) e devolve os dados + _id. */
export async function prepararUsuario(api: ServeRestApi, usuario: Usuario = novoUsuario()): Promise<UsuarioCadastrado> {
  const response = await api.cadastrarUsuario(usuario);
  await esperarStatus(response, 201, 'pré-condição: cadastrar usuário pela API');
  return { ...usuario, _id: (await response.json())._id };
}

/** Faz login pela API (pré-condição) e devolve o token no formato "Bearer <jwt>". */
export async function obterToken(api: ServeRestApi, email: string, password: string): Promise<string> {
  const response = await api.login(email, password);
  await esperarStatus(response, 200, 'pré-condição: login pela API');
  return (await response.json()).authorization;
}

/** Verifica o status e, se falhar, mostra o corpo da resposta na mensagem de erro. */
export async function esperarStatus(response: APIResponse, status: number, contexto: string) {
  expect(response.status(), `${contexto}: ${await response.text()}`).toBe(status);
}
