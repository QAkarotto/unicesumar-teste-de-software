import { consultarListagens, thresholds } from './comum.js';

export const options = {
  scenarios: {
    carga_progressiva: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '10s', target: 1 },
        { duration: '15s', target: 5 },
        { duration: '15s', target: 10 },
        { duration: '10s', target: 10 },
        { duration: '10s', target: 5 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '10s',
      gracefulStop: '10s',
    },
  },
  thresholds,
};

export default consultarListagens;
