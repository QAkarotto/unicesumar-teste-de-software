
# Atividade 05 – Pesquisa sobre k6

**Disciplina:** Testes de Software  
**Alunos:** Luiz Gustavo Becher Bolzani e Jefferson Luis Namur Junior

## 1. Qual é a finalidade dos testes de desempenho e como os testes de carga se diferenciam dos testes funcionais?

Os testes de desempenho avaliam a velocidade, a estabilidade e a capacidade de resposta de um sistema sob diferentes condições de utilização. Os testes de carga verificam como o sistema se comporta diante de determinada quantidade de usuários e requisições simultâneas. Já os testes funcionais verificam se as funcionalidades apresentam os resultados esperados, sem necessariamente avaliar seu desempenho sob carga.

## 2. O que são usuários virtuais (VUs) e como eles influenciam a carga gerada?

Usuários virtuais (Virtual Users – VUs) representam usuários simulados que executam as ações definidas no script de teste. Quanto maior a quantidade de VUs ativos, maior tende a ser o número de requisições simultâneas, dependendo do tempo de resposta e dos intervalos configurados entre as operações.

## 3. Qual é a diferença entre checks e thresholds no k6?

Checks são verificações realizadas durante a execução para validar condições específicas, como o código HTTP 200. Thresholds são critérios de aceitação definidos para métricas de desempenho, como tempo de resposta e taxa de falhas. Checks registram se as validações passaram ou falharam, enquanto thresholds determinam se os limites estabelecidos foram atendidos.

## 4. O que representam as métricas http_req_duration, http_req_failed e http_reqs?

- **http_req_duration:** mede o tempo total de uma requisição HTTP, considerando envio, espera e recebimento da resposta.
- **http_req_failed:** representa a taxa de requisições HTTP consideradas malsucedidas.
- **http_reqs:** contabiliza a quantidade total de requisições HTTP realizadas durante o teste e permite observar a taxa de requisições por segundo.

## 5. Qual é a importância do percentil 95 (p95) na análise dos tempos de resposta?

O percentil 95 (p95) indica o tempo de resposta abaixo do qual se encontram 95% das requisições analisadas. Essa métrica permite identificar problemas que podem não aparecer na média, oferecendo uma visão mais representativa da experiência dos usuários em situações de maior latência.

## Referências

- GRAFANA LABS. k6 Documentation. https://grafana.com/docs/k6/latest/
- GRAFANA LABS. Checks. https://grafana.com/docs/k6/latest/using-k6/checks/
- GRAFANA LABS. Thresholds. https://grafana.com/docs/k6/latest/using-k6/thresholds/
- GRAFANA LABS. Metrics reference. https://grafana.com/docs/k6/latest/using-k6/metrics/reference/
