# Atividade 05 – 2BIM: Testes de Desempenho com k6 no ServeRest

Testes de carga com [k6](https://grafana.com/docs/k6/latest/) nos endpoints `GET /produtos` e `GET /usuarios` da API
[ServeRest](https://github.com/ServeRest/ServeRest) **rodando localmente**, em dois perfis: carga inicial (1 VU) e carga
progressiva (1 → 5 → 10 VUs e redução gradual).

| Documento | Conteúdo |
| --- | --- |
| [`PESQUISA.md`](PESQUISA.md) | Parte 1: pesquisa sobre k6 |
| [`RELATORIO.md`](RELATORIO.md) | Partes 3 e 4: critérios de desempenho, resultados, comparação e conclusão |
| [`evidencias/`](evidencias/) | saída de cada execução, métricas em JSON, relatórios HTML e o comparativo |

> **Importante:** conforme a documentação do ServeRest, os testes de carga devem rodar **somente em ambiente local**.
> Os scripts se recusam a rodar se a URL apontar para `serverest.dev`.

## Pré-requisitos

- **Node.js 20+**, para subir o ServeRest com `npx` e rodar os scripts de execução.
- **k6**, instalado conforme a [documentação oficial](https://grafana.com/docs/k6/latest/set-up/install-k6/):

  | Sistema | Comando |
  | --- | --- |
  | Windows | `winget install k6 --source winget` (ou `choco install k6`) |
  | macOS | `brew install k6` |
  | Linux | pacote `k6` do repositório da Grafana (ver documentação) |

  Confirme com `k6 version`. No Windows, depois de instalar, feche e abra o terminal para o `k6` entrar no PATH.

## 1. Subir o ServeRest localmente

Em um terminal separado, que deve ficar aberto durante os testes:

```bash
npx serverest@latest
```

Ou, com Docker: `docker run -p 3000:3000 paulogoncalvesbh/serverest:latest`

Confirme que a API está no ar:

- http://localhost:3000/produtos e http://localhost:3000/usuarios respondem com JSON;
- http://localhost:3000/status abre o painel de status do ServeRest (CPU, memória, tempo de resposta e requisições por
  segundo em tempo real). Deixe essa página aberta durante o cenário 2 para acompanhar o servidor.

## 2. Executar os testes

Em outro terminal, dentro de `Entregas-2bim/atividade_5`:

```bash
npm run testes      # cenário 1 e cenário 2, em sequência (~3 min), e gera o comparativo
npm run cenario1    # só o cenário 1 (30 s)
npm run cenario2    # só o cenário 2 (2 min 20 s)
npm run comparar    # refaz o evidencias/comparativo.md a partir das últimas execuções
```

Os scripts não dependem de pacotes npm; não é preciso rodar `npm install`.

Também é possível rodar o k6 direto, sem os scripts de evidência:

```bash
k6 run k6/cenario1-carga-inicial.js
k6 run k6/cenario2-carga-progressiva.js
```

### Configurar a URL da API

A URL fica fora da lógica dos testes, na variável de ambiente `BASE_URL` (padrão `http://localhost:3000`):

```bash
# direto no k6
k6 run -e BASE_URL=http://localhost:3001 k6/cenario1-carga-inicial.js
```

```powershell
# com os scripts npm, no PowerShell
$env:BASE_URL="http://localhost:3001"; npm run testes
```

```bash
# com os scripts npm, no Linux/macOS/Git Bash
BASE_URL=http://localhost:3001 npm run testes
```

Para subir o ServeRest em outra porta: `npx serverest@latest --porta 3001`.

## Estrutura

```
Entregas-2bim/atividade_5/
├── PESQUISA.md                       # Parte 1
├── RELATORIO.md                      # Partes 3 e 4
├── k6/
│   ├── lib/serverest.js              # BASE_URL, thresholds e GET com checks (compartilhados)
│   ├── cenario1-carga-inicial.js     # 1 VU por 30 s
│   └── cenario2-carga-progressiva.js # stages 1 → 5 → 10 → 0 VUs
├── scripts/
│   ├── executar.js                   # roda os cenários e salva a evidência
│   └── comparar.js                   # gera evidencias/comparativo.md
└── evidencias/
```

## Cenários

| | Cenário 1 — Carga inicial | Cenário 2 — Carga progressiva |
| --- | --- | --- |
| Executor | `constant-vus` | `ramping-vus` com `stages` |
| Usuários virtuais | 1 | começa em 1 → 5 (20 s) → mantém 5 (30 s) → 10 (20 s) → mantém 10 (30 s) → 5 (20 s) → 0 (20 s) |
| Duração | 30 s | 2 min 20 s |
| Cada iteração | `GET /produtos`, `GET /usuarios` e pausa de 1 s | igual |
| Volume aproximado | ~2 req/s | até ~20 req/s no pico |

A pausa de 1 s por iteração simula o tempo entre ações de um usuário e mantém o volume controlado. Esta atividade não é
um teste de estresse.

### Checks (em cada resposta)

- `status 200`;
- o corpo tem a lista do recurso (`produtos` ou `usuarios`);
- o campo `quantidade` é igual ao tamanho da lista.

### Thresholds (critérios do teste inteiro)

São os mesmos nos dois cenários, para que a comparação mostre o efeito da carga. A justificativa de cada valor está no
[`RELATORIO.md`](RELATORIO.md#critérios-de-desempenho-thresholds).

| Métrica | Critério |
| --- | --- |
| `http_req_failed` | `rate<0.01` (menos de 1% de falhas) |
| `http_req_duration` | `p(95)<300` e `avg<150` (ms) |
| `http_req_duration{endpoint:produtos}` | `p(95)<300` |
| `http_req_duration{endpoint:usuarios}` | `p(95)<300` |
| `checks` | `rate>0.99` |

## Evidências geradas

Cada execução por `npm run ...` grava em `evidencias/`:

| Arquivo | Conteúdo |
| --- | --- |
| `cenarioN-execucao.txt` | saída completa do k6 (progresso, thresholds, checks e métricas) |
| `cenarioN-resumo.json` | métricas agregadas do fim do teste (`--summary-export`) |
| `cenarioN-dashboard.html` | relatório HTML do web dashboard do k6, com gráficos de VUs, vazão e tempo de resposta ao longo do teste |
| `comparativo.md` | tabela comparativa dos dois cenários e ambiente de execução |

Se algum threshold não for atendido, o k6 termina com código 99, a execução continua para o próximo cenário e o
comparativo mostra ❌ no critério que falhou.
