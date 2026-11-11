import { thresholds, consultar } from './comum.js';

export const options = {
  stages: [
    { duration: '10s', target: 1 },
    { duration: '20s', target: 5 },
    { duration: '20s', target: 10 },
    { duration: '10s', target: 5 },
    { duration: '10s', target: 0 },
  ],
  thresholds,
};

export default function () {
  consultar();
}
