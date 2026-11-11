import { sleep } from 'k6';
import { listar, THRESHOLDS } from './lib/serverest.js';

/**
 * Cenário 2 — Carga progressiva
 * Começa com 1 VU, sobe gradualmente até 5, depois até 10 e reduz gradualmente até 0.
 * Cada patamar fica estável por 30 s para que as métricas daquele nível de carga se acumulem.
 *
 * Duração total: 2 min 20 s. Com 1 s de pausa por iteração, cada VU gera cerca de 2 requisições
 * por segundo, então o pico é de aproximadamente 20 req/s: carga controlada, sem caráter de estresse.
 */
export const options = {
  scenarios: {
    carga_progressiva: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '20s', target: 5 }, // sobe de 1 para 5 VUs
        { duration: '30s', target: 5 }, // mantém 5 VUs
        { duration: '20s', target: 10 }, // sobe de 5 para 10 VUs
        { duration: '30s', target: 10 }, // mantém 10 VUs (pico)
        { duration: '20s', target: 5 }, // reduz para 5 VUs
        { duration: '20s', target: 0 }, // reduz até encerrar
      ],
      gracefulRampDown: '5s',
    },
  },
  thresholds: THRESHOLDS,
};

export default function () {
  listar('produtos');
  listar('usuarios');
  sleep(1);
}
