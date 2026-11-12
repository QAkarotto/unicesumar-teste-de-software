# Atividade 05 - 2º BIM: Testes de Desempenho com k6 no ServeRest

## Objetivo

Compreender os fundamentos dos testes de desempenho e implementar testes de carga utilizando k6, analisando o comportamento da API ServeRest sob diferentes condições de utilização.

## Contexto

O [k6](https://grafana.com/docs/k6/latest/) é uma ferramenta de testes de desempenho que permite simular usuários virtuais, gerar requisições e coletar métricas sobre o comportamento de sistemas.

Nesta atividade, utilizaremos a API ServeRest para observar como o sistema se comporta diante do aumento de requisições simultâneas.

**Importante:** conforme a [documentação oficial do ServeRest](https://github.com/ServeRest/ServeRest#teste-de-carga), os testes de carga devem ser executados **exclusivamente em ambiente local**. **Não execute testes de desempenho contra `https://serverest.dev`.**

## Desenvolvimento

### Parte 1 — Pesquisa sobre k6

Pesquise a documentação oficial do k6 e responda de forma objetiva:

1. Qual é a finalidade dos testes de desempenho e como os testes de carga se diferenciam dos testes funcionais?
2. O que são usuários virtuais (VUs) e como eles influenciam a carga gerada?
3. Qual é a diferença entre `checks` e `thresholds` no k6?
4. O que representam as métricas `http_req_duration`, `http_req_failed` e `http_reqs`?
5. Qual é a importância do percentil 95 (p95) na análise dos tempos de resposta?

### Parte 2 — Preparação do ambiente

Configure o ServeRest para execução local, utilizando uma das alternativas documentadas.

**NPM:**

```bash
npx serverest@latest
```

**Docker:**

```bash
docker run -p 3000:3000 paulogoncalvesbh/serverest:latest
```

Confirme o funcionamento da API em `http://localhost:3000` e consulte a página `http://localhost:3000/status`.

Instale e configure o k6 seguindo sua documentação oficial.

### Parte 3 — Implementação dos testes

Utilizando k6 e JavaScript, implemente testes para os endpoints:

- `GET /produtos`
- `GET /usuarios`

Configure dois perfis de execução:

**Cenário 1 — Carga inicial**

- 1 usuário virtual.
- Duração de 30 segundos.
- Requisições aos dois endpoints.
- Verificação dos códigos de resposta esperados.

**Cenário 2 — Carga progressiva**

- Aumento gradual da quantidade de usuários virtuais.
- Início com 1 VU, crescimento até 5 e depois até 10 VUs.
- Redução gradual da carga ao final.
- Verificação dos resultados das requisições.

Mantenha o volume de requisições controlado e evite testes de estresse nesta atividade.

**Requisitos técnicos:**

- Utilizar `http.get()` para realizar as requisições.
- Implementar `checks` para validar as respostas.
- Configurar `thresholds` para avaliar tempo de resposta e taxa de falhas.
- Utilizar `stages` para definir a progressão de usuários virtuais.
- Permitir que a URL da API seja configurada sem alterar diretamente a lógica dos testes.

Os critérios de desempenho utilizados nos `thresholds` deverão ser apresentados e justificados no relatório.

### Parte 4 — Análise dos resultados

Execute os dois cenários e compare os resultados obtidos.

Apresente um relatório contendo:

- Quantidade de usuários virtuais.
- Duração da execução.
- Total de requisições e taxa de requisições por segundo.
- Tempo médio de resposta.
- Tempo de resposta no percentil 95 (p95).
- Taxa de falhas.
- Resultado dos `checks` e `thresholds`.

Com base nos resultados, **EXPLIQUE** como o aumento da carga afetou o desempenho do ServeRest e quais limitações devem ser consideradas na interpretação dos dados.

## Entrega

Realize a entrega por Pull Request no repositório da disciplina, contendo:

1. Respostas da pesquisa em Markdown.
2. Scripts de testes de desempenho com k6.
3. Instruções para configurar e executar os testes localmente.
4. Evidências da execução dos dois cenários.
5. Relatório comparativo dos resultados e conclusão técnica.

## Critérios de avaliação

Serão considerados a compreensão dos conceitos pesquisados, a implementação dos cenários, a configuração adequada das métricas e critérios de desempenho, a qualidade das evidências e a interpretação dos resultados.

## Referências

- [Documentação oficial do k6](https://grafana.com/docs/k6/latest/)
- [Execução de testes com k6](https://grafana.com/docs/k6/latest/get-started/running-k6/)
- [Repositório e instruções oficiais do ServeRest](https://github.com/ServeRest/ServeRest)
- [Documentação da API ServeRest](https://serverest.dev/)
