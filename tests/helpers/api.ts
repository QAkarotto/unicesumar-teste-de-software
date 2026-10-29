import { APIRequestContext } from "@playwright/test";


export async function deletarUsuario(
    request: APIRequestContext,
    id: string,
    token: string
) {

    return await request.delete(`/usuarios/${id}`, {

        headers: {
            Authorization: token
        }

    });

}