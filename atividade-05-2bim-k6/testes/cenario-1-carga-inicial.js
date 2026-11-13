// Cenário 1 — carga inicial: 1 usuário virtual consultando /produtos e /usuarios durante 30 segundos.
import { consultarProdutosEUsuarios, criterios, estatisticasDoResumo } from './comum.js';

export const options = {
  scenarios: {
    carga_inicial: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
    },
  },
  thresholds: criterios,
  summaryTrendStats: estatisticasDoResumo,
};

export default function () {
  consultarProdutosEUsuarios();
}
