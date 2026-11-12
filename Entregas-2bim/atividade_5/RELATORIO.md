# Relatório — Testes de desempenho com k6 no ServeRest

## 1. Objetivo e escopo

Observar como a API ServeRest, executada localmente, se comporta quando a quantidade de usuários simultâneos aumenta,
comparando uma carga inicial (1 usuário virtual) com uma carga progressiva (até 10 usuários virtuais). Foram testados os
endpoints públicos de listagem `GET /produtos` e `GET /usuarios`.

## 2. Configuração dos testes

| | Cenário 1 — Carga inicial | Cenário 2 — Carga progressiva |
| --- | --- | --- |
| Script | `k6/cenario1-carga-inicial.js` | `k6/cenario2-carga-progressiva.js` |
| Executor | `constant-vus` | `ramping-vus` (`startVUs: 1` + `stages`) |
| Usuários virtuais | 1 | 1 → 5 → 10 → 5 → 0 |
| Duração planejada | 30 s | 2 min 20 s |
| Iteração | `GET /produtos` + `GET /usuarios` + `sleep(1)` | igual |
| Vazão esperada | ~2 req/s | ~2 req/s por VU, até ~20 req/s no pico |

Progressão do cenário 2 (`stages`):

| Etapa | Duração | VUs |
| --- | --- | --- |
| Subida | 20 s | 1 → 5 |
| Patamar | 30 s | 5 |
| Subida | 20 s | 5 → 10 |
| Patamar (pico) | 30 s | 10 |
| Redução | 20 s | 10 → 5 |
| Redução | 20 s | 5 → 0 |

Os dois cenários usam o mesmo código de requisição e as mesmas verificações, definidos em `k6/lib/serverest.js`. A
URL da API vem da variável `BASE_URL`, e os scripts recusam a URL do ServeRest público.

**Checks em cada resposta:** status 200; corpo com a lista do recurso; campo `quantidade` igual ao tamanho da lista.
Assim, cada resposta é validada pelo conteúdo, e não só pelo status.

## 3. Critérios de desempenho (thresholds)

Os critérios são **os mesmos nos dois cenários**. Assim, a diferença entre os resultados reflete o aumento da carga, e
não uma mudança de régua.

| Threshold | Por quê |
| --- | --- |
| `http_req_failed: rate<0.01` | São listagens públicas, sem autenticação e sem dependência externa. Em condição normal, nenhuma deveria falhar. A tolerância de 1% absorve um erro isolado do ambiente sem esconder um problema sistemático: no cenário 2, 1% equivale a cerca de 17 requisições. |
| `http_req_duration: p(95)<300` | A API roda na mesma máquina do k6, sem latência de rede, e devolve poucos registros. O tempo esperado é de poucos milissegundos. 300 ms deixa margem para variações do computador e continua abaixo do limite de 1 s em que o usuário percebe a espera e perde o fluxo ([Nielsen, 3 limites de tempo de resposta](https://www.nngroup.com/articles/response-times-3-important-limits/)). O p95 é usado em vez do máximo para não reprovar o teste por um pico isolado. |
| `http_req_duration: avg<150` | Metade do limite do p95. Garante que a resposta **típica** continue rápida: se tudo ficar mais lento de forma geral, a média denuncia mesmo com a cauda dentro do limite. |
| `http_req_duration{endpoint:produtos}: p(95)<300` e `{endpoint:usuarios}: p(95)<300` | O mesmo critério aplicado a cada endpoint separadamente, para que um endpoint mais rápido não esconda a lentidão do outro na métrica geral. |
| `checks: rate>0.99` | A resposta precisa ser correta, não só rápida. A tolerância acompanha a de `http_req_failed`. |

Os limites são propositalmente folgados para uma API local. O objetivo da atividade é **comparar** o comportamento
entre os cenários sem chegar ao limite do servidor, e não fazer um teste de estresse. Na seção 6, a análise compara os
valores obtidos com esses limites.

## 4. Ambiente de execução

| Item | Valor |
| --- | --- |
| Data da execução | 11/11/2026 |
| Sistema | Windows (notebook pessoal); CPU e memória detalhadas em `evidencias/comparativo.md` |
| ServeRest | v3.2.2, executado com `npx serverest@latest` em `http://localhost:3000` |
| k6 | v2.3.0 (`windows/amd64`) |
| Node.js | v24.20.0 (apenas para subir o ServeRest e rodar os scripts de evidência) |
| Topologia | k6 e ServeRest na mesma máquina, comunicando pela interface local (*loopback*) |
| Base de dados | a padrão do ServeRest: 2 produtos e 1 usuário |

Execução: `npm run testes`, que roda o cenário 1 e, em seguida, o cenário 2. As saídas completas estão em
`evidencias/cenario1-execucao.txt` e `evidencias/cenario2-execucao.txt`.

## 5. Resultados

### Visão geral

| Métrica | Cenário 1 — Carga inicial | Cenário 2 — Carga progressiva |
| --- | ---: | ---: |
| Usuários virtuais | 1 | 1 → 10 → 0 (máximo 10; média de 6,1 no tempo) |
| Duração da execução | 30,1 s | 2 min 20,4 s (140,4 s) |
| Iterações | 30 | 860 |
| **Total de requisições** | **60** | **1.720** |
| **Requisições por segundo** | **1,99** | **12,25** |
| **Tempo médio de resposta** | **1,77 ms** | **1,20 ms** |
| Mediana | 1,45 ms | 1,09 ms |
| p90 | 2,06 ms | 2,11 ms |
| **p95** | **2,51 ms** | **2,37 ms** |
| p99 | 15,17 ms | 2,95 ms |
| Máximo | 16,67 ms | 3,72 ms |
| **Taxa de falhas** (`http_req_failed`) | **0,00%** (0 de 60) | **0,00%** (0 de 1.720) |
| Checks aprovados | 100% (180 de 180) | 100% (5.160 de 5.160) |
| Thresholds atendidos | 6 de 6 | 6 de 6 |
| Dados recebidos | 46 kB | 1,3 MB |

### Por endpoint

| Endpoint | Cenário 1: média / p95 / p99 | Cenário 2: média / p95 / p99 |
| --- | --- | --- |
| `GET /produtos` | 2,20 ms / 2,92 ms / 10,99 ms | 1,28 ms / 2,64 ms / 3,23 ms |
| `GET /usuarios` | 1,34 ms / 1,49 ms / 12,28 ms | 1,12 ms / 2,18 ms / 2,59 ms |

### Thresholds

| Métrica | Critério | Cenário 1 | Cenário 2 |
| --- | --- | --- | --- |
| `http_req_failed` | `rate<0.01` | ✅ 0,00% | ✅ 0,00% |
| `http_req_duration` | `p(95)<300` | ✅ 2,51 ms | ✅ 2,37 ms |
| `http_req_duration` | `avg<150` | ✅ 1,77 ms | ✅ 1,20 ms |
| `http_req_duration{endpoint:produtos}` | `p(95)<300` | ✅ 2,92 ms | ✅ 2,64 ms |
| `http_req_duration{endpoint:usuarios}` | `p(95)<300` | ✅ 1,49 ms | ✅ 2,18 ms |
| `checks` | `rate>0.99` | ✅ 100% | ✅ 100% |

### Vazão por patamar de carga

Tirado do progresso do k6 em `cenario2-execucao.txt` (iterações completas por segundo nos trechos estáveis):

| Patamar | Iterações/s observadas | Requisições/s | Esperado (VUs × 2 req ÷ 1 s) |
| --- | ---: | ---: | ---: |
| Cenário 1: 1 VU (0 s–30 s) | 1,0 | 2 | 2 |
| Cenário 2: 5 VUs (21 s–54 s) | 5,0 (de 50 para 215 em 33 s) | 10 | 10 |
| Cenário 2: 10 VUs (1 min 11 s–1 min 44 s) | 10,0 (de 340 para 670 em 33 s) | 20 | 20 |

## 6. Análise: efeito do aumento da carga

**A vazão cresceu na mesma proporção dos usuários virtuais.** O cenário 2 gerou 12,25 req/s contra 1,99 req/s do
cenário 1, cerca de 6,2 vezes mais. Esse fator é exatamente a média de VUs ativos no cenário 2: o perfil de `stages`
soma 860 VU·segundos em 140 s, ou seja, 6,1 VUs em média. Com 1 s de pausa por iteração, isso dá 860 iterações, que é
o número que o k6 completou. Nos patamares, o servidor atendeu 5 iterações/s com 5 VUs e 10 iterações/s com 10 VUs. A
duração da iteração ficou em 1 s (máximo de 1,01 s) do começo ao fim. Como o k6 usa o modelo fechado, em que cada VU
espera a resposta antes de seguir, qualquer lentidão do servidor teria aparecido como menos iterações que o planejado.
Isso não aconteceu: **o ServeRest não foi o gargalo em nenhum momento**.

**O tempo de resposta não piorou com mais carga.** Ele ficou na faixa de 1 a 3 ms nos dois cenários. A média e a
mediana até ficaram menores no cenário 2 (1,77 → 1,20 ms e 1,45 → 1,09 ms), e o p95 ficou praticamente igual
(2,51 → 2,37 ms). Os dois endpoints mostram o mesmo comportamento. O `GET /usuarios` teve o p95 um pouco maior no
cenário 2 (1,49 → 2,18 ms), mas a diferença é inferior a 1 ms e está dentro da variação esperada para medições tão
pequenas. O `GET /produtos` é levemente mais lento que o `GET /usuarios` nos dois cenários, o que é coerente com uma
resposta maior (2 produtos com mais campos contra 1 usuário).

**A diferença visível está na cauda do cenário 1, e ela se explica pelo tamanho da amostra.** O p99 (15,17 ms) e o
máximo (16,67 ms) do cenário 1 são bem maiores que os do cenário 2 (2,95 ms e 3,72 ms). Com apenas 60 requisições, o
p99 é praticamente a requisição mais lenta, então uma ou duas respostas lentas definem esses números. A causa provável
é o aquecimento: o cenário 1 foi o primeiro a rodar logo após o ServeRest subir, quando ainda havia compilação JIT do
Node.js, a primeira leitura da base em arquivo e a abertura de conexões. O gráfico de tempo de resposta em
`evidencias/cenario1-dashboard.html` permite conferir em que momento esses picos ocorreram. No cenário 2, com o servidor
já aquecido e 1.720 amostras, a cauda ficou estreita (p99 de 2,95 ms). Não há sinal de enfileiramento: quando o
servidor começa a saturar, o p95 e o p99 sobem junto com os VUs, e aqui eles ficaram estáveis.

**Folga em relação aos critérios.** O p95 do cenário 2 (2,37 ms) ficou cerca de 125 vezes abaixo do limite de 300 ms,
e a média (1,20 ms) também cerca de 125 vezes abaixo dos 150 ms. Não houve nenhuma falha HTTP nem nenhuma check
reprovada entre 5.340 verificações. Ou seja, a faixa de carga desta atividade (até 10 VUs, cerca de 20 req/s no pico)
está muito abaixo da capacidade do ServeRest local para esses endpoints. O teste mostra que o sistema **atende bem esta
carga**, mas não mostra **onde fica o limite**. Para encontrá-lo seria preciso um teste de estresse ou de
*breakpoint* (muito mais VUs, sem pausa, ou executores de taxa de chegada), o que está fora do escopo desta atividade.

## 7. Limitações na interpretação dos dados

1. **Gerador de carga e servidor na mesma máquina.** O k6 e o ServeRest disputaram a mesma CPU e memória, com o
   IntelliJ e o navegador abertos. Por outro lado, a comunicação foi pela interface local, sem latência de rede. Por
   isso, os tempos absolutos (1–3 ms) são muito menores que os de uma API acessada pela internet e não devem ser lidos
   como o tempo que um usuário real teria.
2. **Base de dados mínima.** Com 2 produtos e 1 usuário, as listagens devolvem poucos bytes. Os endpoints testados
   devolvem a coleção inteira, então com milhares de registros o custo de consulta e de serialização cresceria, e os
   resultados poderiam ser bem diferentes.
3. **Só leitura e sem autenticação.** Operações de escrita (cadastros, carrinho) envolvem validação e gravação em
   arquivo (NeDB) e tendem a ser mais pesadas e a disputar acesso. Elas não foram exercitadas.
4. **Carga baixa por desenho.** A pausa de 1 s por iteração e o máximo de 10 VUs limitam o volume a cerca de 20 req/s.
   Isso atende ao pedido de evitar estresse, mas significa que nenhum dos cenários chegou perto da saturação.
5. **Execuções curtas e únicas.** Cada cenário rodou uma vez, sem repetição nem período de aquecimento separado. O
   cenário 1 tem só 60 amostras, então o p99 e o máximo dependem de uma ou duas requisições. Para conclusões mais
   firmes, seria preciso repetir as execuções e comparar a variação, ou descartar o primeiro trecho como aquecimento.
6. **Resolução do relógio.** Em valores abaixo de 1 ms, a precisão da medição no Windows é limitada. O k6 chegou a
   registrar mínimo de `0s` no cenário 2. Diferenças de décimos de milissegundo entre os cenários não são
   significativas.
7. **Ambiente local diferente do público.** No modo local (`npx`/Docker), o ServeRest desliga o limitador de
   requisições que protege o `serverest.dev`, e o painel `/status` fica ativo. O ambiente público também roda com
   recursos limitados. Os resultados valem para a instância local e não representam o desempenho do `serverest.dev`,
   que, por esse mesmo motivo, não deve receber testes de carga.

## 8. Conclusão

Nos dois perfis, o ServeRest local respondeu a todas as requisições corretamente (0% de falhas, 100% das checks) e
atendeu a todos os thresholds com ampla folga. Ao passar de 1 para até 10 usuários virtuais, a vazão aumentou na mesma
proporção dos VUs (de ~2 para ~12 req/s em média e 20 req/s no pico), enquanto o tempo de resposta se manteve estável
em poucos milissegundos (p95 de 2,51 ms com 1 VU e de 2,37 ms com até 10 VUs). Dentro da faixa testada, **o aumento da
carga não degradou o desempenho**: o sistema escalou de forma linear, sem fila, sem erros e sem aumento da cauda de
latência. A única variação relevante, o p99 e o máximo mais altos do cenário 1, é explicada pela amostra pequena e pelo
aquecimento do servidor, e não pela carga.

Esses números descrevem uma API local, com base mínima, apenas leituras e carga controlada. Eles indicam que o ServeRest
lida com folga com essa faixa de uso, mas não determinam o limite de capacidade nem o comportamento em produção. O
próximo passo natural, sempre em ambiente local, seria repetir os cenários algumas vezes e então aplicar um teste de
estresse ou de *breakpoint* com uma base maior e com operações de escrita, para descobrir a partir de que carga o p95 e a
taxa de falhas começam a subir.

## 9. Evidências

| Arquivo | Conteúdo |
| --- | --- |
| `evidencias/cenario1-execucao.txt`, `evidencias/cenario2-execucao.txt` | saída completa do k6 de cada cenário |
| `evidencias/cenario1-resumo.json`, `evidencias/cenario2-resumo.json` | métricas agregadas exportadas pelo k6 (`--summary-export`) |
| `evidencias/cenario1-dashboard.html`, `evidencias/cenario2-dashboard.html` | relatório HTML do web dashboard do k6, com gráficos de VUs, vazão e tempo de resposta ao longo do teste |
| `evidencias/comparativo.md` | tabela comparativa gerada automaticamente e dados da máquina |
