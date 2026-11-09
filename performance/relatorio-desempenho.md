# Relatório de Testes de Desempenho - ServeRest com k6

## 1. Introdução

Este trabalho teve como objetivo realizar testes de desempenho na API ServeRest utilizando a ferramenta k6. Foram realizados dois cenários de teste para observar o comportamento da API em diferentes condições de carga.

Todos os testes foram executados exclusivamente em ambiente local, utilizando Docker e o endereço http://localhost:3000.

## 2. Ambiente de testes

- Ferramenta de desempenho: k6 versão 2.3.0.
- API: ServeRest.
- Ambiente: Docker local.
- Endereço utilizado: http://localhost:3000.
- Sistema operacional: Windows.
- Endpoints avaliados:
  - GET /produtos
  - GET /usuarios

## 3. Critérios de avaliação

Foram utilizados os seguintes critérios:

- Checks: verificar se os endpoints retornavam HTTP 200.
- http_req_duration: medir o tempo de resposta das requisições.
- http_req_failed: medir a proporção de requisições com falha.
- p95: avaliar o tempo de resposta de 95% das requisições.

Foram definidos os seguintes thresholds:

- http_req_duration: p(95) inferior a 1000 ms.
- http_req_failed: taxa de falhas inferior a 1%.

Esses limites foram definidos como critérios de avaliação para este experimento.

## 4. Cenário 1 - Carga inicial

O primeiro teste foi executado com 1 usuário virtual durante 30 segundos.

Resultados obtidos:

| Métrica | Resultado |
|---|---:|
| Usuários virtuais | 1 |
| Duração | 30 segundos |
| Iterações concluídas | 30 |
| Requisições HTTP | 60 |
| Checks aprovados | 60 (100%) |
| Checks reprovados | 0 |
| Tempo médio de resposta | 12,88 ms |
| Tempo mínimo | 3,83 ms |
| Tempo máximo | 229,86 ms |
| Percentil 95 (p95) | 26,12 ms |
| Taxa de falhas HTTP | 0% |

Os dois endpoints retornaram HTTP 200 em todas as verificações. Os thresholds definidos foram aprovados.

## 5. Cenário 2 - Carga progressiva

O segundo teste utilizou estágios de carga progressiva, aumentando gradualmente a quantidade de usuários virtuais:

- 1 usuário virtual durante 10 segundos.
- 5 usuários virtuais durante 20 segundos.
- 10 usuários virtuais durante 20 segundos.
- Redução para 0 usuários durante 10 segundos.

Resultados obtidos:

| Métrica | Resultado |
|---|---:|
| Usuários virtuais máximos | 10 |
| Duração dos estágios | 60 segundos |
| Iterações concluídas | 255 |
| Requisições HTTP | 510 |
| Checks aprovados | 510 (100%) |
| Checks reprovados | 0 |
| Tempo médio de resposta | 6,62 ms |
| Tempo mínimo | 3,26 ms |
| Tempo máximo | 78,99 ms |
| Percentil 95 (p95) | 15,56 ms |
| Taxa de falhas HTTP | 0% |

Os endpoints continuaram respondendo corretamente mesmo com o aumento da quantidade de usuários virtuais. Os thresholds também foram aprovados.

## 6. Comparação dos cenários

| Métrica | Carga inicial | Carga progressiva |
|---|---:|---:|
| Usuários virtuais máximos | 1 | 10 |
| Requisições HTTP | 60 | 510 |
| Tempo médio | 12,88 ms | 6,62 ms |
| p95 | 26,12 ms | 15,56 ms |
| Taxa de falhas | 0% | 0% |
| Checks aprovados | 100% | 100% |

Os resultados demonstraram que a API apresentou respostas rápidas nos dois cenários. Mesmo com o aumento para 10 usuários virtuais, não foram registradas falhas nas requisições.

O tempo de resposta menor no segundo cenário não significa necessariamente que o aumento da carga melhorou o desempenho. Os testes foram realizados em execuções distintas e podem apresentar variações.

## 7. Conclusão

A realização dos testes permitiu compreender a importância dos testes de desempenho e como utilizar o k6 para simular diferentes quantidades de usuários acessando uma API.

No cenário inicial, com um usuário virtual, todas as requisições foram concluídas com sucesso. No cenário progressivo, mesmo chegando a dez usuários virtuais simultâneos, a API manteve respostas rápidas e não apresentou falhas.

Conclui-se que, nas condições avaliadas e dentro dos limites definidos, a API ServeRest apresentou comportamento estável. Entretanto, testes com volumes maiores e períodos mais longos seriam necessários para identificar os limites reais de capacidade do sistema.

## 8. Arquivos de evidência

Os scripts e resultados dos testes estão armazenados na pasta performance:

- carga-inicial.js
- carga-progressiva.js
- resultados-carga-inicial.json
- resultados-carga-progressiva.json

Os arquivos JSON contêm os resumos gerados pelo k6 durante as execuções.
