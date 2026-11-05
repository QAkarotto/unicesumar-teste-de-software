# Pesquisa sobre k6

**Atividade 05 - Testes de Desempenho com k6**

**Integrantes:** Severo Junior e Bruno Laroca Rosa

### 1. Qual é a finalidade dos testes de desempenho e como os testes de carga se diferenciam dos testes funcionais?

Os testes de desempenho avaliam a velocidade e a estabilidade de um sistema. Os testes de carga verificam como ele se comporta com vários usuários acessando ao mesmo tempo. Já os testes funcionais verificam se as funcionalidades estão funcionando corretamente.

### 2. O que são usuários virtuais (VUs) e como eles influenciam a carga gerada?

São usuários simulados pelo k6. Quanto maior a quantidade de VUs, mais acessos podem acontecer ao mesmo tempo, aumentando a carga sobre o sistema.

### 3. Qual é a diferença entre checks e thresholds no k6?

Os checks verificam se as respostas estão corretas, como o código HTTP 200. Os thresholds definem limites de desempenho que o sistema deve cumprir, como tempo de resposta e taxa de falhas.

### 4. O que representam as métricas http_req_duration, http_req_failed e http_reqs?

- `http_req_duration`: tempo gasto para completar as requisições HTTP.
- `http_req_failed`: porcentagem de requisições que falharam.
- `http_reqs`: quantidade de requisições realizadas e sua taxa por segundo.

### 5. Qual é a importância do percentil 95 (p95) na análise dos tempos de resposta?

O p95 mostra o tempo abaixo do qual 95% das requisições foram concluídas. Ele ajuda a identificar respostas mais lentas que podem não aparecer claramente na média.

## Referências

- https://grafana.com/docs/k6/latest/
- https://grafana.com/docs/k6/latest/using-k6/metrics/
- https://grafana.com/docs/k6/latest/using-k6/thresholds/