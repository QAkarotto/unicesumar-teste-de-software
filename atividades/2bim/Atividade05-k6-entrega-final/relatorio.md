# Relatório — Atividade 05 (2º BIM)
## Testes de desempenho com k6 no ServeRest
  
**Ambiente:** ServeRest local em http://localhost:3000; Windows, Node.js v26.13.0, k6 v2.3.0.

> **Execução realizada:** a API local respondeu HTTP 200 em /status, /produtos e /usuarios. Ambos os cenários foram executados localmente com BASE_URL=http://localhost:3000. Os logs completos e sumários JSON estão em resultados/.

## 1. Pesquisa sobre k6

### Finalidade dos testes de desempenho e diferença para testes funcionais

Testes de desempenho medem como um sistema responde sob determinadas condições de carga, observando latência, vazão e erros. O teste de carga aplica volume esperado ou progressivo de usuários/requisições para caracterizar o comportamento e localizar degradação. O teste funcional verifica regras e comportamento esperado de operações; pode usar poucas chamadas e não mede por si só capacidade ou tempo sob concorrência. Neste exercício, os checks verificam comportamento (HTTP 200), enquanto métricas e thresholds avaliam desempenho.

### Usuários virtuais (VUs)

VUs são execuções virtuais independentes do fluxo descrito no script. Cada VU executa iterações; em ramping-vus, sua quantidade muda ao longo do tempo pelos stages. Mais VUs normalmente elevam concorrência e carga. Cada VU aqui faz dois GETs sequenciais e aguarda um segundo; portanto, o número de VUs não equivale a uma taxa fixa de req/s: a latência também afeta o ritmo do modelo fechado.

### Checks e thresholds

Um check registra se uma asserção da resposta passou (por exemplo, status HTTP 200); por si só, um check reprovado não encerra o processo k6 com falha. Um threshold define um critério pass/fail para uma métrica agregada; se não for atendido, k6 termina com código diferente de zero. São complementares: checks verificam correção e thresholds verificam metas de desempenho/qualidade.

### Métricas solicitadas

- http_req_duration: duração total de envio, espera e recebimento do corpo da resposta (não inclui DNS nem estabelecimento de conexão conforme a definição da métrica HTTP do k6). É uma Trend e o resumo inclui média e percentis.
- http_req_failed: taxa de requisições consideradas falhas pelo callback de resposta do k6.
- http_reqs: contador total de requisições HTTP; o resumo também mostra a taxa média por segundo.

### Importância do p95

O p95 é o tempo abaixo do qual terminaram 95% das requisições; os 5% mais lentos ficam acima dele. Mostra a cauda da distribuição e complementa a média, que pode esconder respostas lentas. Deve ser lido junto da contagem de chamadas e duração do teste.

## 2. Preparação e execução

Inicie a API localmente via npx serverest@latest ou pela imagem Docker descrita no README. Confirme http://localhost:3000/status e os endpoints. O teste não acessa serverest.dev: o código recusa BASE_URL fora de loopback.

Rode .\scripts\executar.ps1 no PowerShell. A URL configurável continua limitada a loopback. Logs e sumários gerados pelo script são guardados em resultados/.

## 3. Implementação e critérios

Cada iteração executa GET /produtos e GET /usuarios, checados para HTTP 200, e aguarda 1 s. Cenário inicial: 1 VU por 30 s. Cenário progressivo: inicia com 1 VU, sobe gradualmente para 5 e 10, mantém 10 por 20 s e reduz até zero. O teto é 10 VUs; este perfil não é um teste de estresse.

| Threshold | Critério | Justificativa |
|---|---:|---|
| http_req_duration | p95 < 1000 ms | Meta educacional simples para API local, que deixa a cauda visível sem presumir SLO oficial do ServeRest. |
| http_req_failed | taxa < 1% | Exige que pelo menos 99% das requisições não sejam classificadas como falhas. |
| checks | taxa > 99% | Exige que mais de 99% dos checks de status HTTP 200 passem. |

São critérios deste exercício, não garantia do fornecedor nem especificação oficial de desempenho. Hardware, sistema operacional e estado do processo influenciam os resultados.

## 4. Resultados — preencher após executar

Copie o resumo impresso pelo k6. http_reqs é o total; http_req_duration contém avg e p(95); http_req_failed e checks mostram taxas. Marque os thresholds como aprovados/reprovados conforme o bloco THRESHOLDS de cada log.

| Medida | Cenário 1 — inicial | Cenário 2 — progressivo |
|---|---:|---:|
| VUs (mín./máx.) | 1 / 1 | 1 / 10 |
| Duração configurada | 30 s | 90 s (+ parada graciosa se necessária) |
| Total de requisições (http_reqs) | 60 | 1020 |
| Taxa média (req/s) | 1,981548 | 11,288989 |
| Tempo médio (http_req_duration avg) | 1,87 ms | 1,38 ms |
| p95 (http_req_duration p(95)) | 3,38 ms | 3,84 ms |
| Falhas (http_req_failed) | 0/60 (0%) | 0/1020 (0%) |
| Checks passados/total | 60/60 (100%) | 1020/1020 (100%) |
| Resultado dos thresholds | Todos aprovados | Todos aprovados |
| Evidência | resultados/cenario-1.log, cenario-1.json | resultados/cenario-2.log, cenario-2.json |

### Evidências

Os logs e sumários JSON reais estão em resultados/. Eles registram cenário, VUs, checks, thresholds e métricas. A consulta local aos três endpoints retornou HTTP 200 e está anotada em resultados/status-local.log.

## 5. Comparação e conclusão técnica

A carga progressiva gerou 1020 requisições em 90 s, contra 60 em 30 s no cenário inicial. A taxa média subiu de 1,98 para 11,29 req/s (cerca de 5,7 vezes), refletindo o tempo maior e a progressão até 10 VUs. O p95 passou de 3,38 ms para 3,84 ms (aumento de 0,46 ms, cerca de 13,6%), enquanto a média caiu de 1,87 ms para 1,38 ms. Não houve requisições falhas: 0% em ambos os cenários. Os checks passaram em 100% e os três thresholds foram aprovados em ambos. Nesta execução local, o ServeRest sustentou a carga exercitada, com pequena elevação do p95 e sem erros; os valores ficaram muito abaixo do limite de 1 s.

Limitações: teste curto, apenas dois GETs, workload sintético e fechado, mesma máquina gera carga e hospeda o serviço, variação de CPU/memória/processos, cache/conexões e execução única. No cenário inicial foram apenas 60 chamadas, portanto o p95 tem uma amostra pequena. A latência de loopback é muito baixa e não representa acesso pela rede. VUs não equivalem a usuários humanos nem representam req/s fixos. Os resultados descrevem esta execução local e não devem ser extrapolados para produção ou outros ambientes.

## Referências

1. [k6 — documentação oficial](https://grafana.com/docs/k6/latest/)
2. [k6 — teste de desempenho](https://grafana.com/docs/k6/latest/examples/get-started-with-k6/test-for-performance/)
3. [k6 — instalação](https://grafana.com/docs/k6/latest/set-up/install-k6/)
4. [k6 — executor ramping-vus](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-vus/)
5. [k6 — checks](https://grafana.com/docs/k6/latest/using-k6/checks/)
6. [k6 — thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/)
7. [k6 — métricas HTTP](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/)
8. [ServeRest — repositório e opções locais](https://github.com/ServeRest/ServeRest)
9. [ServeRest — documentação da API](https://serverest.dev/)
