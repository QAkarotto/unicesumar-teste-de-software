# Pesquisa — k6

## 1. Finalidade dos testes de desempenho e diferença para testes funcionais

Testes de desempenho medem tempos de resposta, vazão e falhas diante de uma carga definida. Permitem identificar degradações e verificar critérios de desempenho. Testes de carga exercitam o sistema com um volume controlado de acessos simultâneos; testes funcionais verificam se entradas, saídas e regras de negócio estão corretas. Os dois se complementam: uma resposta pode estar correta e ainda ser lenta. Fonte: [testes de carga de API — Grafana](https://grafana.com/docs/k6/latest/testing-guides/api-load-testing/).

## 2. Usuários virtuais (VUs)

Cada VU é um contexto independente que executa a função de teste repetidamente, simulando um usuário concorrente. Mais VUs permitem mais fluxos simultâneos. A taxa de requisições também depende das pausas e do tempo das respostas: dobrar VUs não garante dobrar requisições por segundo. Neste trabalho, cada VU consulta dois endpoints sequencialmente, com pausa de 1 segundo após cada GET. Fontes: [execução dos VUs](https://grafana.com/docs/learning-hub/k6-performance-testing/02-your-first-test/08-what-k6-is/) e [modelo fechado](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/).

## 3. Diferença entre checks e thresholds

`checks` verificam condições de uma resposta, como status 200 ou conteúdo JSON. Uma falha é contabilizada, mas isoladamente não reprova a execução. `thresholds` são critérios de aprovação sobre métricas agregadas, como `p(95)<500` e `rate<0.01`. Se um deles falhar, k6 encerra com código diferente de zero. O threshold `checks: ['rate==1']` faz uma falha de check reprovar o teste. Fontes: [checks](https://grafana.com/docs/k6/latest/using-k6/checks/) e [thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/).

## 4. Métricas solicitadas

| Métrica | Significado |
| --- | --- |
| `http_req_duration` | Duração do envio, espera e recebimento da resposta, em milissegundos. Exclui a resolução DNS e o estabelecimento inicial da conexão. Permite calcular média e percentis. |
| `http_req_failed` | Proporção de requisições consideradas malsucedidas conforme a política de status esperados. Nesta implementação, somente HTTP 200 é aceito; erros de transporte também contam como falha. `0.01` corresponde a 1%. |
| `http_reqs` | Contador do total de requisições HTTP realizadas. O resumo também apresenta a taxa média em requisições por segundo. |

Fonte: [métricas nativas do k6](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/).

## 5. Importância do percentil 95 (p95)

O p95 é o tempo abaixo do qual se encontram aproximadamente 95% das observações; os 5% restantes são mais lentos. Ajuda a perceber respostas lentas que a média pode ocultar. Por exemplo, `p(95)<500` exige um p95 inferior a 500 ms, mas não exige que todas as respostas cumpram esse limite. Deve ser interpretado junto da média, das falhas e do tamanho da amostra. Fonte: [métricas e percentis — Grafana](https://grafana.com/docs/learning-hub/k6-performance-testing/02-your-first-test/10-what-k6-measures/).

Documentação consultada em 12/11/2026.
