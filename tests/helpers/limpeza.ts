import { APIRequestContext, test } from '@playwright/test';

/**
 * Registra os recursos criados durante um teste e os remove ao final.
 *
 * A ordem de remoção respeita as regras do ServeRest:
 *   1. carrinhos  (cancelar a compra devolve o estoque e libera produto/usuário)
 *   2. produtos   (não podem ser excluídos enquanto estiverem em um carrinho)
 *   3. usuários   (não podem ser excluídos enquanto tiverem carrinho)
 *
 * Todas as exclusões são idempotentes: se o próprio teste já tiver removido o
 * recurso, a API apenas responde "Nenhum registro excluído".
 */
export class RegistroDeLimpeza {
  private readonly usuarios = new Set<string>();
  private readonly produtos = new Map<string, string>(); // id -> token de admin
  private readonly carrinhos = new Set<string>(); // token do dono do carrinho

  registrarUsuario(id: string) {
    this.usuarios.add(id);
  }

  registrarProduto(id: string, token: string) {
    this.produtos.set(id, token);
  }

  registrarCarrinho(tokenDoDono: string) {
    this.carrinhos.add(tokenDoDono);
  }

  async executar(request: APIRequestContext) {
    const total = this.carrinhos.size + this.produtos.size + this.usuarios.size;
    if (total === 0) return;

    await test.step(`Limpeza: remover ${total} recurso(s) criado(s) pelo teste`, async () => {
      for (const token of this.carrinhos) {
        await this.remover(request, '/carrinhos/cancelar-compra', token);
      }
      for (const [id, token] of this.produtos) {
        await this.remover(request, `/produtos/${id}`, token);
      }
      for (const id of this.usuarios) {
        await this.remover(request, `/usuarios/${id}`);
      }
    });
  }

  private async remover(request: APIRequestContext, caminho: string, token?: string) {
    const response = await request.delete(caminho, {
      headers: token ? { Authorization: token } : {},
    });
    // A limpeza não deve derrubar um teste que já passou; apenas avisa no log.
    if (!response.ok()) {
      console.warn(`[limpeza] DELETE ${caminho} -> ${response.status()} ${await response.text()}`);
    }
  }
}
