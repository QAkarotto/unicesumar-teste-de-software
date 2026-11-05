import { test } from '@playwright/test';
import { ServeRestApi } from './api';

/**
 * Agenda a remoção da massa de dados criada por um teste e a executa no teardown da fixture.
 *
 * Os registros são identificados pelo dado único (e-mail ou nome) e não pelo _id, porque
 * usuários e produtos cadastrados pela INTERFACE não devolvem o _id para o teste.
 * A remoção acontece mesmo quando o teste falha no meio do caminho.
 *
 * Ordem: produtos primeiro (precisam do token do admin, que é removido depois) e usuários por último.
 */
export class RegistroDeLimpeza {
  private readonly produtos = new Map<string, string>(); // nome -> token de admin
  private readonly usuarios = new Set<string>(); // e-mail

  removerUsuarioAoFinal(email: string) {
    this.usuarios.add(email);
  }

  removerProdutoAoFinal(nome: string, tokenAdmin: string) {
    this.produtos.set(nome, tokenAdmin);
  }

  async executar(api: ServeRestApi) {
    const total = this.produtos.size + this.usuarios.size;
    if (total === 0) return;

    await test.step(`Limpeza: remover ${total} registro(s) criado(s) pelo teste`, async () => {
      for (const [nome, token] of this.produtos) {
        for (const id of await api.buscarIdsDeProdutos(nome)) {
          avisarSeFalhar(`produto ${nome}`, await api.excluirProduto(id, token));
        }
      }
      for (const email of this.usuarios) {
        for (const id of await api.buscarIdsDeUsuarios(email)) {
          avisarSeFalhar(`usuário ${email}`, await api.excluirUsuario(id));
        }
      }
    });
  }
}

// A limpeza não deve derrubar um teste que já passou; apenas registra no log.
function avisarSeFalhar(registro: string, response: { ok(): boolean; status(): number }) {
  if (!response.ok()) console.warn(`[limpeza] não foi possível remover ${registro}: HTTP ${response.status()}`);
}
