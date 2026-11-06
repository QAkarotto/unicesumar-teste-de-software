# Pesquisa — fundamentos do k6

Autores: Gustavo Santana Barbosa e Lorenzo Rupel Bobeck.

## 1. Finalidade dos testes de desempenho e diferença para testes funcionais

Testes de desempenho medem rapidez, vazão e estabilidade sob determinada utilização. Testes de carga observam essas características com usuários concorrentes e um volume planejado de acessos. Testes funcionais verificam se o comportamento está correto: por exemplo, se uma listagem retorna HTTP 200 e os dados esperados. Uma API pode passar nas verificações funcionais e responder lentamente quando vários usuários a acessam. [Fonte: testes de carga no k6](https://grafana.com/docs/k6/latest/testing-guides/test-types/load-testing/).

## 2. Usuários virtuais (VUs)

VUs são unidades de execução que simulam usuários concorrentes, repetindo o fluxo do script. Mais VUs tendem a gerar mais requisições simultâneas, mas não definem sozinhos o RPS: latência, quantidade de requisições por iteração e pausas também influenciam a carga. Nesta atividade cada iteração faz duas consultas sequenciais e pausa um segundo. [Fonte: execução e VUs](https://grafana.com/docs/k6/latest/get-started/running-k6/).

## 3. Checks e thresholds

Checks validam condições em cada resposta, como código HTTP e estrutura do JSON. Um check falso é contabilizado, mas sozinho não reprova a execução. Thresholds definem critérios de aprovação sobre métricas agregadas, como `p(95)<500` e `rate<0.01`; seu descumprimento faz o k6 encerrar com código diferente de zero. O threshold `checks: ['rate==1']` exige todos os checks aprovados. Fontes: [checks](https://grafana.com/docs/k6/latest/using-k6/checks/) e [thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/).

## 4. Métricas HTTP

| Métrica | Significado |
| --- | --- |
| `http_req_duration` | Tempo de envio, espera e recebimento da resposta. Não inclui o estabelecimento inicial da conexão nem DNS. É uma distribuição de tempos, em ms no resumo. |
| `http_req_failed` | Proporção de requisições classificadas como falhas pelo callback de resposta. Nos scripts, apenas HTTP 200 é considerado esperado. Não equivale à taxa de checks falsos. |
| `http_reqs` | Contador do total de requisições HTTP geradas. O resumo também informa a taxa média em requisições por segundo. |

[Fonte: métricas nativas do k6](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/).

## 5. Importância do p95

O p95 é o tempo abaixo do qual ficam aproximadamente 95% das respostas da amostra; os 5% restantes podem ser mais lentos. Ajuda a identificar lentidão na cauda da distribuição que a média pode esconder. Não é o tempo máximo, não garante o desempenho de todas as requisições e pode variar bastante com poucas amostras. Por isso deve ser interpretado junto com média, erros e volume. Fontes: [métricas](https://grafana.com/docs/k6/latest/using-k6/metrics/) e [critério de percentil nos thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/).
