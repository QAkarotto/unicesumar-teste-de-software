import { test, expect } from '@playwright/test';

test.describe('Testes ServeRest', () => { 
    test("Teste criar usuario", async ({ request }) => {
        
        const resposta = await request.post('https://serverest.dev/usuarios', {
            data: {
                nome: "Fulano da Silva",
                email: "aleatorios@hotmail.com",
                password: "teste123",
                administrador: "true"
            }
        });

        expect(resposta.status()).toBe(201);

        const body  = await resposta.json();
        expect(body.message).toBe("Cadastro realizado com sucesso");
        expect(body._id).toBeTruthy();
        
    });

    test("Teste criar usuario com email existente", async ({ request }) => {
        const resposta = await request.post('https://serverest.dev/usuarios', {
            data: {
                nome: "teste",
                email: "testeteste@hotmail.com",
                password: "teste123",
                administrador: "true"
            }
        });
        expect(resposta.status()).toBe(400);
        const body = await resposta.json();
        expect(body.message).toBe("Este email já está sendo usado");
    });

    test("Teste realizar login com usuario valido", async ({ request }) => {

        const email = "testeteste@hotmail.com";
        const senha = "teste123";

        await request.post('https://serverest.dev/usuarios', {
            data: {
                nome: "testando",
                email: email,
                password: senha,
                administrador: "true"
            }
        });

        const resposta = await request.post('https://serverest.dev/login', {
            data: {
                email: email,
                password: senha
            }
        });

        expect(resposta.status()).toBe(200);

        const body = await resposta.json();
        expect(body.message).toBe("Login realizado com sucesso");

    });

    test("Teste listar usuarios", async ({ request }) => {
        const resposta = await request.get("https://serverest.dev/usuarios");
        expect(resposta.status()).toBe(200);
        const body = await resposta.json();
        expect(body.quantidade).toBeGreaterThan(0);
    });

    test("Teste não permitir cadastrar produto sem token", async ({ request }) => {
        const resposta = await request.post("https://serverest.dev/produtos", {
            data: {
                nome: "Produto Teste",
                preco: 100,
                descricao: "Produto de teste",
                quantidade: 10
            }
        });

        expect(resposta.status()).toBe(401);
        const body = await resposta.json();
        expect(body.message).toBe("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
    });

    test("Teste tentar logar com senha errada", async ({ request }) => {
        const resposta = await request.post('https://serverest.dev/login', {
            data: {
                email: "fulano@qa.com",
                password: "senhadeerroteste"
            }
        });
        expect(resposta.status()).toBe(401);
        const body = await resposta.json();
        expect(body.message).toBe("Email e/ou senha inválidos");
    })

})
