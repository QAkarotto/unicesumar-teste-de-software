import { sleep } from 'k6';
import { listar, THRESHOLDS } from './lib/serverest.js';

/**
 * Cenário 1 — Carga inicial
 * 1 usuário virtual por 30 segundos. A cada iteração o VU consulta os dois endpoints e espera 1 s
 * (tempo de "pensar" de um usuário), o que mantém o volume de requisições baixo e controlado.
 * Serve de linha de base para comparar com o cenário 2.
 */
export const options = {
  scenarios: {
    carga_inicial: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
    },
  },
  thresholds: THRESHOLDS,
};

export default function () {
  listar('produtos');
  listar('usuarios');
  sleep(1);
}
