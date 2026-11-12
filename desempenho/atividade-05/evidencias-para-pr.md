# Evidências de execução — Atividade 05 / 2º bimestre

Testes executados em **12/11/2026**, exclusivamente em `http://localhost:3000`, com ServeRest **3.2.2**, Node.js **22.22.1** e k6 **2.4.0**. Branch da entrega: `feature/atividade3-2bi-gustavo-nicholas`.

| Indicador | Cenário 1 — 1 VU | Cenário 2 — até 10 VUs |
| --- | ---: | ---: |
| Duração programada | 30 s | 75 s |
| Duração observada | 30,146 s | 76,216 s |
| Total de requisições | 30 | 462 |
| Taxa média | 0,995 req/s | 6,062 req/s |
| Tempo médio | 3,919 ms | 1,910 ms |
| p95 | 11,690 ms | 3,274 ms |
| Taxa de falhas HTTP | 0% | 0% |
| Checks aprovados | 60/60 | 924/924 |
| Thresholds aprovados | 8/8 | 8/8 |
| Código de saída | 0 | 0 |

## Saída real — cenário 1

```text
Início: 2026-11-12T14:55:11-03:00
Comando: k6 run --no-color --quiet -e BASE_URL=http://localhost:3000 scripts/cenario-1.js
API: http://localhost:3000
Duração observada: 30.146 s
Requisições: 30 | Taxa: 0.995 req/s
Tempo médio: 3.919 ms | p95: 11.690 ms
Falhas HTTP: 0.00%
Checks: 60 aprovados, 0 reprovados

Verificações:
  GET /produtos: status 200: 15 aprovados, 0 reprovados
  GET /produtos: lista e quantidade consistentes: 15 aprovados, 0 reprovados
  GET /usuarios: status 200: 15 aprovados, 0 reprovados
  GET /usuarios: lista e quantidade consistentes: 15 aprovados, 0 reprovados

Thresholds:
  PASSOU http_req_failed{endpoint:usuarios}: rate<0.01
  PASSOU http_req_failed: rate<0.01
  PASSOU http_req_failed{endpoint:produtos}: rate<0.01
  PASSOU http_req_duration: avg<300
  PASSOU http_req_duration: p(95)<500
  PASSOU http_req_duration{endpoint:produtos}: p(95)<500
  PASSOU http_req_duration{endpoint:usuarios}: p(95)<500
  PASSOU checks: rate==1
Fim: 2026-11-12T14:55:41-03:00
Código de saída: 0
```

## Saída real — cenário 2

```text
Início: 2026-11-12T14:55:41-03:00
Comando: k6 run --no-color --quiet -e BASE_URL=http://localhost:3000 scripts/cenario-2.js
API: http://localhost:3000
Duração observada: 76.216 s
Requisições: 462 | Taxa: 6.062 req/s
Tempo médio: 1.910 ms | p95: 3.274 ms
Falhas HTTP: 0.00%
Checks: 924 aprovados, 0 reprovados

Verificações:
  GET /produtos: status 200: 231 aprovados, 0 reprovados
  GET /produtos: lista e quantidade consistentes: 231 aprovados, 0 reprovados
  GET /usuarios: status 200: 231 aprovados, 0 reprovados
  GET /usuarios: lista e quantidade consistentes: 231 aprovados, 0 reprovados

Thresholds:
  PASSOU http_req_failed{endpoint:produtos}: rate<0.01
  PASSOU http_req_duration: avg<300
  PASSOU http_req_duration: p(95)<500
  PASSOU http_req_failed: rate<0.01
  PASSOU checks: rate==1
  PASSOU http_req_duration{endpoint:produtos}: p(95)<500
  PASSOU http_req_duration{endpoint:usuarios}: p(95)<500
  PASSOU http_req_failed{endpoint:usuarios}: rate<0.01
Fim: 2026-11-12T14:56:57-03:00
Código de saída: 0
```

## Arquivos originais

- Cenário 1: [log completo](https://github.com/QAkarotto/unicesumar-teste-de-software/blob/feature/atividade3-2bi-gustavo-nicholas/desempenho/atividade-05/evidencias/cenario-1.log) e [resumo JSON](https://github.com/QAkarotto/unicesumar-teste-de-software/blob/feature/atividade3-2bi-gustavo-nicholas/desempenho/atividade-05/evidencias/cenario-1.json).
- Cenário 2: [log completo](https://github.com/QAkarotto/unicesumar-teste-de-software/blob/feature/atividade3-2bi-gustavo-nicholas/desempenho/atividade-05/evidencias/cenario-2.log) e [resumo JSON](https://github.com/QAkarotto/unicesumar-teste-de-software/blob/feature/atividade3-2bi-gustavo-nicholas/desempenho/atividade-05/evidencias/cenario-2.json).
- [Ambiente de execução](https://github.com/QAkarotto/unicesumar-teste-de-software/blob/feature/atividade3-2bi-gustavo-nicholas/desempenho/atividade-05/evidencias/ambiente.txt).
- [HTTP 200 da documentação local](https://github.com/QAkarotto/unicesumar-teste-de-software/blob/feature/atividade3-2bi-gustavo-nicholas/desempenho/atividade-05/evidencias/documentacao.headers.txt) e [HTTP 200 do painel /status](https://github.com/QAkarotto/unicesumar-teste-de-software/blob/feature/atividade3-2bi-gustavo-nicholas/desempenho/atividade-05/evidencias/status.headers.txt).
- [Relatório comparativo e conclusão técnica](https://github.com/QAkarotto/unicesumar-teste-de-software/blob/feature/atividade3-2bi-gustavo-nicholas/desempenho/atividade-05/relatorio.md).

O aumento da carga elevou a vazão média em aproximadamente 6,09 vezes, sem falhas observadas. Os tempos menores no segundo cenário não comprovam melhora causada pela carga: houve somente uma execução de cada perfil, sem aquecimento separado e com API e gerador compartilhando a máquina. O relatório apresenta as limitações completas.
