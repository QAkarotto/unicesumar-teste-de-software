import { opcoesComuns } from './comum.js';

export const options = {
  ...opcoesComuns,
  scenarios: {
    carga_progressiva: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '15s', target: 5 },
        { duration: '15s', target: 10 },
        { duration: '15s', target: 10 },
        { duration: '15s', target: 5 },
        { duration: '15s', target: 0 },
      ],
      gracefulRampDown: '5s',
      gracefulStop: '5s',
    },
  },
};

export { executar as default, salvarResumo as handleSummary } from './comum.js';
