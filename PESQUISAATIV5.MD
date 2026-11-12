# PESQUISA – ATIVIDADE 05
## Testes de Desempenho com k6

### 1. Qual é o objetivo dos testes de desempenho? Qual a diferença entre testes de carga e testes funcionais?

Os testes de desempenho têm como objetivo avaliar o comportamento de uma aplicação em determinadas condições de uso, observando aspectos como tempo de resposta, estabilidade, capacidade de processamento e quantidade de requisições suportadas.

Os testes de carga verificam como o sistema se comporta quando recebe diferentes volumes de acessos simultâneos. Já os testes funcionais verificam se as funcionalidades estão funcionando corretamente, de acordo com os requisitos definidos. Portanto, enquanto os testes funcionais avaliam se o sistema faz o que deveria, os testes de carga analisam como ele se comporta sob demanda.

### 2. O que são VUs (Virtual Users) no k6 e como eles influenciam a carga gerada?

VUs, ou usuários virtuais, representam execuções simuladas que realizam as operações definidas no script de teste. Cada usuário virtual executa as instruções da função principal do script, podendo realizar requisições repetidamente durante o período configurado.

O aumento da quantidade de VUs geralmente aumenta a concorrência e o volume de requisições enviadas à aplicação. Dessa forma, é possível observar como o sistema reage à medida que mais usuários acessam seus recursos simultaneamente.

### 3. Qual a diferença entre checks e thresholds no k6?

Os **checks** são verificações utilizadas para validar as respostas recebidas durante o teste. Por exemplo, podem verificar se uma requisição retornou o código HTTP 200, indicando sucesso.

Os **thresholds** estabelecem critérios quantitativos para avaliar o resultado geral do teste. Eles podem definir limites para métricas como tempo de resposta e taxa de falhas. Caso esses critérios não sejam atendidos, o k6 considera o teste reprovado.

Assim, os checks verificam a correção das respostas individuais, enquanto os thresholds avaliam se o desempenho geral atende aos limites estabelecidos.

### 4. O que significam as métricas http_req_duration, http_req_failed e http_reqs?

- **http_req_duration:** representa o tempo total gasto em uma requisição HTTP, considerando o envio dos dados, o tempo de espera pela resposta e o recebimento dos dados.
- **http_req_failed:** representa a proporção de requisições HTTP consideradas malsucedidas durante o teste.
- **http_reqs:** contabiliza a quantidade total de requisições HTTP realizadas. O resumo também apresenta a taxa média de requisições por segundo.

Essas métricas permitem avaliar a velocidade de resposta, a ocorrência de falhas e o volume de tráfego gerado durante a execução.

### 5. Por que o p95 é importante na análise de desempenho?

O p95, ou percentil 95, representa o tempo dentro do qual 95% das requisições foram concluídas. Os 5% restantes tiveram tempos de resposta superiores a esse valor.

Essa métrica é importante porque permite identificar lentidões que poderiam passar despercebidas ao analisar somente a média. Um tempo médio baixo não significa necessariamente que todas as requisições responderam rapidamente. Por isso, o p95 ajuda a avaliar a experiência da maioria dos usuários e identificar possíveis problemas de desempenho.

### Referências

GRAFANA LABS. **Grafana k6 Documentation**. Disponível em: https://grafana.com/docs/k6/latest/. Acesso em: 12 nov. 2026.

GRAFANA LABS. **Thresholds**. Disponível em: https://grafana.com/docs/k6/latest/using-k6/thresholds/. Acesso em: 12 nov. 2026.

GRAFANA LABS. **Test for performance**. Disponível em: https://grafana.com/docs/k6/latest/examples/get-started-with-k6/test-for-performance/. Acesso em: 12 nov. 2026.