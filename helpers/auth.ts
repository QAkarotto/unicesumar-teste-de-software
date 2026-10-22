import { APIRequestContext } from '@playwright/test';
import { criarUsuarioDto } from '../data/factories';

export async function obterTokenAutenticacao(request: APIRequestContext): Promise<string> {
  const usuario = criarUsuarioDto();
  
  // Cadastra o utilizador dinamicamente
  await request.post('/usuarios', {
    data: usuario,
  });

  // Realiza o login para obter o token
  const respostaLogin = await request.post('/login', {
    data: {
      email: usuario.email,
      password: usuario.password,
    },
  });

  const dadosLogin = await respostaLogin.json();
  return dadosLogin.authorization;
}
