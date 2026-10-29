class ProdutosController {
  constructor(produtoModel, loggerService) {
    this.produtoModel = produtoModel;
    this.loggerService = loggerService;
  }

  async cadastrar(dados) {
    // 1. Validação de regra de negócio: preço não pode ser negativo
    if (dados.preco < 0) {
      throw new Error('O preço não pode ser negativo');
    }

    // 2. Verificação de duplicidade usando a dependência (ProdutoModel)
    const produtoExistente = await this.produtoModel.findOne({ nome: dados.nome });
    if (produtoExistente) {
      throw new Error('Já existe produto com este nome');
    }

    // 3. Cenário alternativo: aplica valor padrão para descrição caso não venha informada
    const payload = {
      ...dados,
      descricao: dados.descricao || 'Sem descrição'
    };

    // 4. Persistência do dado
    const novoProduto = await this.produtoModel.create(payload);

    // 5. Notificação/Auditoria via LoggerService (observado pelo Spy)
    this.loggerService.registrarLog(`Produto cadastrado com sucesso: ${novoProduto.nome}`);

    return novoProduto;
  }
}

module.exports = ProdutosController;