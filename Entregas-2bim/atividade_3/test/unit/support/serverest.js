'use strict'

/**
 * Carrega módulos do código-fonte do ServeRest.
 *
 * O código testado vem do pacote npm `serverest` (versão fixa no package.json),
 * que publica a pasta src/ do projeto (https://github.com/ServeRest/ServeRest).
 *
 * Como o Node guarda os módulos em cache, o objeto devolvido aqui é o MESMO que
 * os controllers e middlewares do ServeRest recebem no require deles. Por isso,
 * substituir um método com o Sinon (ex.: usuariosService.existeUsuario) troca a
 * dependência que a unidade testada realmente chama.
 */
module.exports = caminho => require(`serverest/src/${caminho}`)
