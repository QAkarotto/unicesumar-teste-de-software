# Relatório de Testes de Desempenho

**Atividade 05 - Testes de Desempenho com k6**

**Integrantes:** Severo Junior e Bruno Laroca Rosa

## Ambiente de testes

Os testes foram executados localmente, utilizando o ServeRest 3.2.2 e o k6, com a API disponível em `http://localhost:3000`.

Foram utilizados os endpoints `GET /produtos` e `GET /usuarios`.

## Cenários executados

**Cenário 1 — Carga inicial:** 1 usuário virtual durante 30 segundos.

**Cenário 2 — Carga progressiva:** aumento gradual de 1 para 5 e depois 10 usuários virtuais, seguido da redução da carga, durante 60 segundos.

## Comparação dos resultados

| Métrica | Carga inicial | Carga progressiva |
|---|---|---|
| Usuários virtuais | 1 | Até 10 |
| Duração real | 30,6 s | 60,5 s |
| Total de requisições | 60 | 478 |
| Requisições por segundo | 1,96 | 7,91 |
| Tempo médio | 9,04 ms | 10,94 ms |
| Tempo p95 | 15,51 ms | 26,96 ms |
| Taxa de falhas | 0,00% | 0,00% |
| Checks aprovados | 60 de 60 | 478 de 478 |
| Thresholds | Aprovados | Aprovados |

## Critérios de desempenho

Foram utilizados os seguintes thresholds:

- `http_req_duration: p(95)<1000` — pelo menos 95% das requisições devem terminar em menos de 1 segundo.
- `http_req_failed: rate<0.01` — a taxa de falhas deve ficar abaixo de 1%.

Esses limites foram escolhidos como critérios iniciais para avaliar o desempenho da API no ambiente local, com uma carga pequena e controlada.

Nos dois cenários, os thresholds foram atendidos. O p95 ficou abaixo de 1 segundo e nenhuma requisição apresentou falha.

## Análise dos resultados

Com o aumento da quantidade de usuários virtuais, o número de requisições cresceu de 60 para 478. A taxa de requisições por segundo também aumentou, passando de 1,96 para 7,91.

O tempo médio de resposta subiu de 9,04 ms para 10,94 ms, enquanto o p95 passou de 15,51 ms para 26,96 ms.

Isso mostra que o aumento da carga provocou um pequeno crescimento nos tempos de resposta, mas a API continuou respondendo corretamente durante os testes.

## Limitações

Os testes foram realizados em um único computador, com poucos usuários virtuais e duração curta. Por isso, os resultados podem variar conforme o hardware e os processos em execução.

Além disso, o cenário progressivo durou mais tempo e utilizou uma quantidade variável de usuários. Assim, a diferença no total de requisições não depende apenas da quantidade máxima de VUs.

Esses resultados mostram o comportamento do ServeRest nas condições testadas, mas não representam necessariamente seu desempenho em produção.

## Conclusão

O ServeRest apresentou bom desempenho nos dois cenários executados. Mesmo com o aumento da carga até 10 usuários virtuais, todas as requisições foram concluídas sem falhas e os critérios de desempenho foram atendidos.

Concluímos que a API suportou a carga aplicada nos testes locais, apresentando apenas um pequeno aumento no tempo de resposta.