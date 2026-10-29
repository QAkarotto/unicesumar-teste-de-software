class ProdutoModel {
  static async findOne(query) {
    throw new Error('Método não implementado para ambiente real sem mock');
  }

  static async create(dados) {
    throw new Error('Método não implementado para ambiente real sem mock');
  }
}

module.exports = ProdutoModel;