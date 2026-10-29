class ProdutosController {
  constructor(produtoModel, loggerService) {
    this.produtoModel = produtoModel;
    this.loggerService = loggerService;
  }

  async cadastrar(dados) {
    if (dados.preco < 0) {
      throw new Error('O preço não pode ser negativo');
    }

    
    const produtoExistente = await this.produtoModel.findOne({ nome: dados.nome });
    if (produtoExistente) {
      throw new Error('Já existe produto com este nome');
    }

    const payload = {
      ...dados,
      descricao: dados.descricao || 'Sem descrição'
    };

    const novoProduto = await this.produtoModel.create(payload);

    this.loggerService.registrarLog(`Produto cadastrado com sucesso: ${novoProduto.nome}`);

    return novoProduto;
  }
}

module.exports = ProdutosController;