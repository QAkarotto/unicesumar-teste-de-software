import { test, expect } from '../fixtures/api.fixture';
import { prepararUsuario } from '../helpers/auth';
import { novoUsuario } from '../data/factories';

test.describe('Usuários - /usuarios', () => {
  test('CT05 - deve cadastrar usuário com dados gerados dinamicamente e persistir os dados', async ({ api }) => {
    const usuario = novoUsuario({ administrador: 'false' });

    const cadastro = await api.cadastrarUsuario(usuario);
    expect(cadastro.status()).toBe(201);
    const { message, _id } = await cadastro.json();
    expect(message).toBe('Cadastro realizado com sucesso');
    expect(_id).toMatch(/^[a-zA-Z0-9]{16}$/);

    const consulta = await api.buscarUsuario(_id);
    expect(consulta.status()).toBe(200);
    expect(await consulta.json()).toEqual({ ...usuario, _id });
  });

  test('CT06 - não deve permitir dois usuários com o mesmo e-mail (regra de negócio)', async ({ api }) => {
    const existente = await prepararUsuario(api);

    const response = await api.cadastrarUsuario(novoUsuario({ email: existente.email }));

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ message: 'Este email já está sendo usado' });

    // Estado final: continua existindo apenas o cadastro original
    const busca = await api.listarUsuarios({ email: existente.email });
    const { quantidade, usuarios } = await busca.json();
    expect(quantidade).toBe(1);
    expect(usuarios[0]._id).toBe(existente._id);
  });

  test('CT07 - deve rejeitar cadastro com dados inválidos informando o erro de cada campo', async ({ api }) => {
    const response = await api.cadastrarUsuario({
      nome: '',
      email: 'email-sem-arroba',
      password: '',
      administrador: 'talvez',
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      nome: 'nome não pode ficar em branco',
      email: 'email deve ser um email válido',
      password: 'password não pode ficar em branco',
      administrador: "administrador deve ser 'true' ou 'false'",
    });
  });

  test('CT08 - deve editar um usuário e permitir login com as novas credenciais', async ({ api }) => {
    const original = await prepararUsuario(api, { administrador: 'false' });
    const alterado = novoUsuario({ administrador: 'true' });

    const edicao = await api.editarUsuario(original._id, alterado);
    expect(edicao.status()).toBe(200);
    expect((await edicao.json()).message).toBe('Registro alterado com sucesso');

    // Estado final do recurso
    const consulta = await api.buscarUsuario(original._id);
    expect(await consulta.json()).toEqual({ ...alterado, _id: original._id });

    // Credenciais antigas deixam de funcionar e as novas passam a funcionar
    expect((await api.login({ email: original.email, password: original.password })).status()).toBe(401);
    expect((await api.login({ email: alterado.email, password: alterado.password })).status()).toBe(200);
  });

  test('CT09 - deve excluir um usuário e ele não deve mais ser encontrado', async ({ api }) => {
    const usuario = await prepararUsuario(api);

    const exclusao = await api.excluirUsuario(usuario._id);
    expect(exclusao.status()).toBe(200);
    expect((await exclusao.json()).message).toBe('Registro excluído com sucesso');

    const consulta = await api.buscarUsuario(usuario._id);
    expect(consulta.status()).toBe(400);
    expect(await consulta.json()).toEqual({ message: 'Usuário não encontrado' });
  });
});
