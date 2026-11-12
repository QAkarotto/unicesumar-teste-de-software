# Evidências de execução

Execução local realizada em 11/11/2026 contra http://localhost:3000 com k6 v2.3.0.

- status-local.log: confirma HTTP 200 em /status, /produtos e /usuarios.
- cenario-1.log e cenario-1.json: carga inicial (1 VU por 30 s).
- cenario-2.log e cenario-2.json: carga progressiva (1 a 10 VUs, ramp-up e ramp-down, 90 s).

Os logs guardam a saída completa do k6, incluindo checks, thresholds e resumo de métricas. Os resultados foram transcritos em ../relatorio.md.
