# Pesquisa sobre k6

## 1. Finalidade dos testes de desempenho e diferença para testes funcionais

Testes de desempenho avaliam tempos de resposta, capacidade de atendimento e estabilidade sob determinada demanda. Testes de carga observam esse comportamento com um volume definido de usuários e requisições. Testes funcionais verificam se uma funcionalidade produz o resultado esperado. Por exemplo, validar que uma consulta retorna HTTP 200 é uma verificação funcional; medir sua velocidade e taxa de erros com vários usuários simultâneos é uma avaliação de desempenho.

Fonte: [Tipos de testes de desempenho — Grafana k6](https://grafana.com/docs/k6/latest/testing-guides/test-types/).

## 2. Usuários virtuais e carga gerada

Usuários virtuais (VUs) executam o fluxo do script simultaneamente e repetem suas iterações durante o teste. Aumentar os VUs geralmente aumenta a concorrência e a carga. A taxa de requisições também depende dos tempos de resposta e das pausas: 10 VUs não equivalem necessariamente a 10 requisições por segundo.

Fonte: [Executores — Grafana k6](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/).

## 3. Diferença entre checks e thresholds

Checks verificam condições nas respostas, como o código HTTP ser 200, e registram aprovações e falhas. Uma falha de check, isoladamente, não reprova toda a execução. Thresholds estabelecem critérios de aprovação sobre métricas, como p95 inferior a 500 ms e taxa de falhas inferior a 1%. Se um threshold não for atendido, o k6 termina com código de saída diferente de zero. Também é possível definir um threshold para a taxa de aprovação dos checks.

Fontes: [Checks](https://grafana.com/docs/k6/latest/using-k6/checks/) e [Thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/).

## 4. Métricas

| Métrica | Significado |
|---|---|
| `http_req_duration` | Tempo de envio, espera e recebimento da requisição. Não inclui a resolução inicial de DNS nem o estabelecimento da conexão. |
| `http_req_failed` | Proporção de requisições consideradas malsucedidas segundo a configuração de respostas esperadas. Nesta atividade, somente HTTP 200 é considerado sucesso. |
| `http_reqs` | Total de requisições HTTP realizadas. O resumo também apresenta a taxa por segundo. |

Fonte: [Métricas nativas — Grafana k6](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/).

## 5. Importância do p95

O percentil 95 é o tempo até o qual aproximadamente 95% das requisições foram concluídas. Um p95 de 100 ms significa que aproximadamente 95% dos tempos ficaram em até 100 ms. Ele evidencia lentidão que pode ficar escondida na média e ajuda a avaliar a experiência das requisições mais lentas. Não é o tempo máximo: os 5% restantes podem ser mais lentos.

Fonte: [Métricas — Grafana k6](https://grafana.com/docs/k6/latest/using-k6/metrics/).
