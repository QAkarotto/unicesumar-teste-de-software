import { thresholds, consultar } from './comum.js';

export const options = { vus: 1, duration: '30s', thresholds };

export default function () {
  consultar();
}
