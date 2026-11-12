# Pesquisa – Testes de Desempenho com k6

## 1. Finalidade dos testes de desempenho e diferença para os testes funcionais

Testes de desempenho avaliam como um sistema se comporta em termos de tempo de resposta, estabilidade e capacidade quando está sob uso, e ajudam a descobrir problemas que só aparecem com muitos acessos. Testes de carga simulam uma quantidade esperada de usuários simultâneos para verificar se o sistema continua rápido e correto nessas condições.

Um teste funcional verifica se uma funcionalidade devolve o resultado correto, normalmente com uma requisição ou um usuário por vez. O teste de carga parte do princípio de que a funcionalidade já funciona e pergunta se ela continua funcionando bem, e dentro de limites de tempo aceitáveis, com vários usuários ao mesmo tempo.

## 2. Usuários virtuais (VUs) e influência na carga

Um usuário virtual (VU) é uma execução simulada do script de teste. Cada VU roda a função principal em repetição e de forma independente das outras, como se fosse uma pessoa usando o sistema. Aumentar o número de VUs aumenta a quantidade de requisições simultâneas e, portanto, a carga. A carga também depende do que o script faz entre uma iteração e outra: com `sleep(1)`, cada VU faz poucas requisições por segundo, e sem pausa a carga seria bem maior com o mesmo número de VUs.

## 3. Diferença entre checks e thresholds

Um **check** valida uma resposta individual, por exemplo se o status é 200 ou se o corpo tem o campo esperado. Se um check falha, o teste continua rodando e o k6 apenas registra a taxa de sucesso.

Um **threshold** é um critério de aprovação definido sobre uma métrica agregada de todo o teste, por exemplo "p95 do tempo de resposta menor que 500 ms". Se o critério não for atendido, o k6 marca o teste como reprovado e termina com código de saída diferente de zero, o que permite usá-lo em pipelines de CI.

## 4. Métricas `http_req_duration`, `http_req_failed` e `http_reqs`

- **`http_req_duration`:** tempo total de uma requisição HTTP, somando envio, espera pela resposta do servidor e recebimento da resposta. O k6 calcula média, mediana, mínimo, máximo e percentis (p90, p95).
- **`http_req_failed`:** taxa de requisições que falharam. Por padrão, o k6 considera sucesso respostas com status de 200 a 399 e falha as demais (e erros de rede).
- **`http_reqs`:** número total de requisições HTTP feitas durante o teste, mostrado também como taxa por segundo.

## 5. Importância do percentil 95 (p95)

O p95 é o valor abaixo do qual ficam 95% dos tempos de resposta; os 5% restantes foram mais lentos. A média pode esconder respostas lentas porque é puxada pelos valores mais rápidos, que costumam ser a maioria. O p95 mostra o que a maior parte dos usuários realmente vivencia, sem ser distorcido por um ou outro valor extremo isolado (que aparece no máximo). Por isso é muito usado como critério de desempenho.

## Referências

- Documentação oficial do k6: https://grafana.com/docs/k6/latest/
- Checks: https://grafana.com/docs/k6/latest/using-k6/checks/
- Thresholds: https://grafana.com/docs/k6/latest/using-k6/thresholds/
- Métricas: https://grafana.com/docs/k6/latest/using-k6/metrics/
- Tipos de teste (carga, estresse etc.): https://grafana.com/docs/k6/latest/testing-guides/test-types/
- ServeRest: https://github.com/ServeRest/ServeRest
