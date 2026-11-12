# Comparativo dos cenários

Gerado em 11/11/2026, 20:42:33 por `scripts/comparar.js` a partir de `cenarioN-resumo.json`.

**Ambiente de execução**

- API: http://localhost:3000 (ServeRest 3.2.2)
- k6: k6.exe v2.3.0 (commit/e088784614, go1.26.8, windows/amd64)
- Máquina: Windows_NT 10.0.26200 · AMD Ryzen 5 7600 6-Core Processor · 12 núcleos lógicos · 15.1 GB de RAM
- k6 e ServeRest rodando na mesma máquina

## Métricas

| Métrica | Cenário 1 — Carga inicial | Cenário 2 — Carga progressiva |
| --- | ---: | ---: |
| Usuários virtuais (máximo) | 1 | 10 |
| Duração da execução | 30.1 s | 140.4 s |
| Iterações | 30 | 860 |
| Total de requisições | 60 | 1720 |
| Requisições por segundo | 1.99 | 12.25 |
| Tempo médio de resposta | 1.77 ms | 1.21 ms |
| Mediana | 1.45 ms | 1.10 ms |
| p90 | 2.06 ms | 2.12 ms |
| p95 | 2.52 ms | 2.37 ms |
| p99 | 15.18 ms | 2.96 ms |
| Máximo | 16.68 ms | 3.73 ms |
| Tempo médio — GET /produtos | 2.21 ms | 1.29 ms |
| p95 — GET /produtos | 2.92 ms | 2.65 ms |
| Tempo médio — GET /usuarios | 1.34 ms | 1.13 ms |
| p95 — GET /usuarios | 1.49 ms | 2.18 ms |
| Taxa de falhas (http_req_failed) | 0.00% | 0.00% |
| Checks aprovados | 100.00% (180 de 180) | 100.00% (5160 de 5160) |
| Thresholds atendidos | 6 de 6 | 6 de 6 |

## Thresholds

| Métrica | Critério | Cenário 1 — Carga inicial | Cenário 2 — Carga progressiva |
| --- | --- | --- | --- |
| `http_req_duration{endpoint:usuarios}` | `p(95)<300` | ✅ 1.49 ms | ✅ 2.18 ms |
| `http_req_failed` | `rate<0.01` | ✅ 0.00% | ✅ 0.00% |
| `http_req_duration` | `p(95)<300` | ✅ 2.52 ms | ✅ 2.37 ms |
| `http_req_duration` | `avg<150` | ✅ 1.77 ms | ✅ 1.21 ms |
| `http_req_duration{endpoint:produtos}` | `p(95)<300` | ✅ 2.92 ms | ✅ 2.65 ms |
| `checks` | `rate>0.99` | ✅ 100.00% | ✅ 100.00% |
