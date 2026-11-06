import { consultarListagens, thresholds } from './comum.js';

export const options = {
  scenarios: {
    carga_inicial: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      gracefulStop: '10s',
    },
  },
  thresholds,
};

export default consultarListagens;
