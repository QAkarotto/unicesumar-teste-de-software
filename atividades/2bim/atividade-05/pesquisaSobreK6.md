# Parte 1 — Pesquisa sobre k6

## 1. Qual é a finalidade dos testes de desempenho e de carga? Qual é a diferença entre eles e os testes funcionais?

Os testes de desempenho têm como objetivo avaliar como um sistema se comporta em relação à velocidade, estabilidade e capacidade de processamento. Eles permitem identificar possíveis lentidões, falhas e limitações quando a aplicação recebe diferentes volumes de requisições.

Os testes de carga são um tipo de teste de desempenho que verifica como o sistema responde a uma quantidade determinada de acessos simultâneos, simulando situações de utilização normal ou de maior movimento.

Já os testes funcionais verificam se as funcionalidades do sistema estão funcionando corretamente, de acordo com os requisitos estabelecidos. Por exemplo, verificar se uma API consegue cadastrar um usuário ou retornar uma lista de produtos.

Portanto, a principal diferença é que os testes funcionais verificam **se o sistema funciona corretamente**, enquanto os testes de desempenho avaliam **como o sistema se comporta durante sua utilização**.

## 2. O que são usuários virtuais (VUs) no k6 e como eles influenciam a carga aplicada ao sistema?

Os usuários virtuais, conhecidos pela sigla VUs (*Virtual Users*), representam usuários simulados pelo k6 durante a execução de um teste. Cada usuário virtual executa as instruções definidas no script, realizando requisições ao sistema.

A quantidade de VUs influencia diretamente o volume de acessos simultâneos que pode ser gerado durante o teste. Por exemplo, um teste com 1 VU simula uma execução individual, enquanto um teste com 10 VUs permite simular várias execuções acontecendo paralelamente.

Dessa maneira, aumentar a quantidade de usuários virtuais permite observar como a aplicação responde ao crescimento da demanda, ajudando a identificar possíveis problemas de desempenho quando há mais acessos simultâneos.

## 3. Qual é a diferença entre `checks` e `thresholds` no k6?

Embora os dois recursos sejam utilizados para avaliar os resultados dos testes, eles possuem finalidades diferentes.

Os **checks** verificam se uma determinada resposta atende a uma condição esperada. Por exemplo, é possível verificar se uma requisição retornou o código HTTP 200 ou se o conteúdo recebido não está vazio. Eles avaliam a resposta de cada execução, registrando os resultados como sucesso ou falha, mas não interrompem o teste quando uma verificação falha.

Já os **thresholds** estabelecem critérios mínimos ou máximos de desempenho que devem ser atendidos durante o teste. Por exemplo, determinar que 95% das requisições devem apresentar tempo de resposta inferior a 1.000 milissegundos ou que a taxa de falhas deve permanecer abaixo de 1%.

Se um threshold não for atendido, o k6 considera a execução como reprovada e retorna um código de saída diferente de zero.

Assim, os checks verificam a **correção das respostas**, enquanto os thresholds avaliam se os **resultados gerais do teste atendem aos critérios de desempenho definidos**.

## 4. O que representam as métricas `http_req_duration`, `http_req_failed` e `http_reqs`?

O k6 coleta automaticamente diversas métricas durante os testes. Entre as principais métricas relacionadas às requisições HTTP, destacam-se:

- **`http_req_duration`:** representa o tempo total gasto na requisição HTTP, desde o início até o recebimento da resposta. É utilizada para avaliar a velocidade de resposta da aplicação. O k6 apresenta valores como média, mínimo, máximo e percentis.

- **`http_req_failed`:** representa a taxa de requisições que foram consideradas malsucedidas. Essa métrica ajuda a identificar problemas de disponibilidade e falhas durante a comunicação com a API.

- **`http_reqs`:** representa a quantidade total de requisições HTTP realizadas durante o teste. Também permite observar a taxa de requisições por segundo, conhecida como RPS (*Requests Per Second*).

A análise conjunta dessas métricas permite compreender melhor o comportamento da aplicação, considerando o tempo de resposta, a ocorrência de falhas e o volume de requisições processadas.

## 5. Por que o percentil 95 (p95) é importante na análise de desempenho?

O percentil 95, representado por p95, indica o tempo de resposta abaixo do qual foram concluídas 95% das requisições realizadas durante o teste. Consequentemente, os 5% restantes apresentaram tempos de resposta iguais ou superiores a esse valor.

Essa métrica é importante porque permite observar o comportamento das requisições mais lentas sem depender exclusivamente do tempo médio. Uma média baixa pode esconder algumas respostas muito demoradas, que prejudicam a experiência dos usuários.

Por exemplo, se o p95 de um teste for de 200 milissegundos, significa que 95% das requisições foram concluídas em até 200 milissegundos. Esse indicador ajuda a avaliar a consistência do tempo de resposta e identificar possíveis lentidões que não aparecem claramente na média.

Por isso, o p95 é bastante utilizado na análise de desempenho e na definição de critérios de qualidade para aplicações e APIs.

## Referências

- [Grafana k6 — Documentação oficial](https://grafana.com/docs/k6/latest/)
- [Grafana k6 — Testes de desempenho de APIs](https://grafana.com/docs/k6/latest/testing-guides/api-load-testing/)
- [Grafana k6 — Métricas](https://grafana.com/docs/k6/latest/using-k6/metrics/)
- [Grafana k6 — Thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/)
- [Grafana k6 — Testes de desempenho](https://grafana.com/docs/k6/latest/examples/get-started-with-k6/test-for-performance/)