# Parte 1 — Pesquisa sobre k6

## 1. Finalidade dos testes de desempenho e diferença dos testes funcionais

Os testes de desempenho verificam como um sistema se comporta em relação a tempo de resposta, capacidade de atendimento, estabilidade e erros quando recebe determinado volume de requisições. Os testes de carga observam o comportamento sob uma carga esperada ou planejada, que pode aumentar gradualmente.

Já os testes funcionais verificam se uma funcionalidade faz o que foi especificado, por exemplo, se `GET /produtos` retorna os produtos e o código HTTP esperado. Um teste funcional normalmente não tem como objetivo medir o comportamento do sistema com vários usuários simultâneos.

## 2. O que são usuários virtuais (VUs)?

VUs são usuários virtuais simulados pelo k6. Cada VU executa o fluxo definido no script, repetindo as iterações enquanto o cenário estiver ativo. Em geral, aumentar o número de VUs aumenta a concorrência e o volume de requisições, dependendo do tempo de resposta e das pausas programadas no script.

## 3. Diferença entre checks e thresholds

- **Checks:** são verificações feitas durante o teste, como confirmar se a resposta de uma requisição possui status HTTP 200. Eles informam a proporção de verificações aprovadas, mas, sozinhos, não fazem a execução inteira terminar com falha.
- **Thresholds:** são critérios de aprovação ou reprovação definidos sobre métricas. Se um limite não for atendido, o k6 marca o teste como falho e retorna um código de saída diferente de zero.

Por isso, é adequado usar os dois: checks para conferir as respostas e thresholds para estabelecer metas mensuráveis de qualidade e desempenho.

## 4. Significado das métricas

- **`http_req_duration`:** duração da requisição HTTP, desde o envio até o recebimento completo da resposta, sem incluir o tempo inicial de DNS e conexão TCP/TLS.
- **`http_req_failed`:** proporção de requisições consideradas falhas pelo k6, conforme a classificação de resposta configurada.
- **`http_reqs`:** contador do total de requisições HTTP realizadas. O resumo também apresenta a taxa por segundo (requisições/s ou RPS).

## 5. Importância do percentil 95 (p95)

O p95 indica o tempo abaixo do qual terminaram 95% das requisições. Os 5% restantes demoraram esse valor ou mais. Ele ajuda a observar a experiência das requisições mais lentas sem depender apenas da média, que pode esconder atrasos pontuais. Ao comparar cenários, um aumento expressivo do p95 pode indicar que a latência está piorando com a concorrência.

## Critérios de desempenho adotados

Os scripts usam inicialmente estes thresholds:

| Métrica | Critério | Justificativa |
|---|---:|---|
| `http_req_duration` | `p(95)<1000` | Para esta atividade, define como objetivo didático que 95% das respostas terminem em menos de 1 segundo. |
| `http_req_failed` | `rate<0.01` | Mantém a taxa de falhas HTTP abaixo de 1%. |
| `checks` | `rate>0.99` | Exige que mais de 99% das verificações funcionais sejam aprovadas. |

Esses valores são critérios definidos para o exercício, não resultados medidos nem metas oficiais do ServeRest. Podem ser ajustados se o professor fornecer outros limites. Como o teste é local, os resultados também dependem do computador, do sistema operacional, de outros processos em execução e da configuração do ambiente.

## Referências

- [Documentação oficial do k6](https://grafana.com/docs/k6/latest/)
- [Checks](https://grafana.com/docs/k6/latest/using-k6/checks/)
- [Thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/)
- [Métricas internas](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/)
- [Execução de testes com k6](https://grafana.com/docs/k6/latest/get-started/running-k6/)
- [Repositório oficial do ServeRest — execução local e teste de carga](https://github.com/ServeRest/ServeRest)
