import {test, expect} from '@playwright/test';
import {faker} from '@faker-js/faker';

test(' Não Deve cadastrar um usuario sem nome', async ({request}) => {

  const usuario = {
    nome: '',
    email: faker.internet.email(),
    password: faker.internet.password(),
    administrador: 'true'
  };

   const resposta = await request.post('/usuarios', {
    data: usuario
  });

   expect(resposta.status()).toBe(400);

   const dados = await resposta.json();

   expect(dados.nome).toBe('nome não pode ficar em branco');
});