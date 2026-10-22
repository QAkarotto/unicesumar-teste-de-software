/** Mensagens retornadas pelo ServeRest, centralizadas para facilitar a manutenção. */
export const MENSAGENS = {
  cadastroRealizado: 'Cadastro realizado com sucesso',
  registroAlterado: 'Registro alterado com sucesso',
  registroExcluido: 'Registro excluído com sucesso',

  loginRealizado: 'Login realizado com sucesso',
  loginInvalido: 'Email e/ou senha inválidos',
  tokenInvalido: 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
  rotaAdministrador: 'Rota exclusiva para administradores',

  emailEmUso: 'Este email já está sendo usado',
  usuarioNaoEncontrado: 'Usuário não encontrado',

  produtoDuplicado: 'Já existe produto com esse nome',
  produtoNaoEncontrado: 'Produto não encontrado',
  produtoEmCarrinho: 'Não é permitido excluir produto que faz parte de carrinho',

  carrinhoNaoEncontrado: 'Carrinho não encontrado',
  maisDeUmCarrinho: 'Não é permitido ter mais de 1 carrinho',
  estoqueInsuficiente: 'Produto não possui quantidade suficiente',
  compraCancelada: 'Registro excluído com sucesso. Estoque dos produtos reabastecido',
} as const;
