import { opcoesComuns } from './comum.js';

export const options = {
  ...opcoesComuns,
  scenarios: {
    carga_inicial: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      gracefulStop: '5s',
    },
  },
};

export { executar as default, salvarResumo as handleSummary } from './comum.js';
