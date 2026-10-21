import { APIRequestContext } from "@playwright/test";
import { criarUsuario } from "../data/factories";


export async function autenticarUsuario(request: APIRequestContext) {

    const usuario = criarUsuario();


    await request.post("/usuarios", {
        data: usuario
    });


    const respostaLogin = await request.post("/login", {
        data: {
            email: usuario.email,
            password: usuario.password
        }
    });


    const corpoLogin = await respostaLogin.json();


    return {
        usuario,
        token: corpoLogin.authorization
    };

}