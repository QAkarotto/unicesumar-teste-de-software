
import type { APIRequestContext } from '@playwright/test';
import { criarUsuario } from '../data/factories';

export async function criarUsuarioAutenticado(
    request: APIRequestContext,
) {
    const usuario = criarUsuario('true');

    const cadastro = await request.post('/usuarios', {
        data: usuario,
    });

    if (cadastro.status() !== 201) {
        throw new Error(
            `Falha ao cadastrar usuário para autenticação: ${await cadastro.text()}`,
        );
    }

    const respostaCadastro = await cadastro.json();
    const usuarioId = respostaCadastro._id as string;

    const login = await request.post('/login', {
        data: {
            email: usuario.email,
            password: usuario.password,
        },
    });

    if (login.status() !== 200) {
        throw new Error(
            `Falha ao autenticar usuário de teste: ${await login.text()}`,
        );
    }

    const respostaLogin = await login.json();

    if (!respostaLogin.authorization) {
        throw new Error(
            'A API não retornou o token de autenticação.',
        );
    }

    return {
        usuario,
        usuarioId,
        token: respostaLogin.authorization as string,
    };
}
