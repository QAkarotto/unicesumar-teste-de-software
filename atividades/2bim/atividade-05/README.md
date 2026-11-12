# Atividade 05 – Testes de Desempenho com k6 no ServeRest

Testes de carga com [k6](https://grafana.com/docs/k6/latest/) contra os endpoints `GET /produtos` e `GET /usuarios` do [ServeRest](https://github.com/ServeRest/ServeRest), executados **somente em ambiente local**.

> **Importante:** não execute testes de carga contra `https://serverest.dev`. O script de teste recusa essa URL e encerra com erro antes de enviar qualquer requisição.

## Pré-requisitos

- [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) (testado com v2.3.0)
- [Node.js](https://nodejs.org/) (para `npx`) **ou** Docker
- Git Bash, PowerShell ou outro terminal

## 1. Subir o ServeRest local

Em um terminal separado, que deve ficar aberto durante os testes:

```bash
npx serverest@latest
```

Ou com Docker:

```bash
docker run -p 3000:3000 paulogoncalvesbh/serverest:latest
```

Confirme o funcionamento:

- API e documentação: http://localhost:3000
- Status: http://localhost:3000/status

## 2. Executar os cenários

Na pasta desta atividade (`atividades/2bim/atividade-05`):

**Cenário 1 – carga inicial (1 VU, 30 s):**

```bash
k6 run --summary-export=evidencias/cenario1.json k6/cenario-1.js
```

**Cenário 2 – carga progressiva (1 → 5 → 10 VUs, depois redução, 70 s):**

```bash
k6 run --summary-export=evidencias/cenario2.json k6/cenario-2.js
```

Para guardar também a saída do terminal em arquivo (Git Bash):

```bash
k6 run --summary-export=evidencias/cenario1.json k6/cenario-1.js | tee evidencias/cenario1-console.txt
```

## 3. Configurar a URL da API

A URL é lida da variável de ambiente `BASE_URL` (padrão: `http://localhost:3000`), sem alterar o código dos testes:

```bash
k6 run -e BASE_URL=http://localhost:3000 k6/cenario-1.js
```

Se a URL contiver `serverest.dev`, o script lança um erro e não executa o teste.

## 4. Validar os scripts sem executar

```bash
k6 inspect k6/cenario-1.js
k6 inspect k6/cenario-2.js
```

## Estrutura

```
atividade-05/
├── PESQUISA.md        # respostas da pesquisa sobre k6
├── README.md          # este arquivo
├── RELATORIO.md       # resultados, análise, limitações e conclusão
├── k6/
│   ├── comum.js       # requisições, checks, thresholds e trava da URL
│   ├── cenario-1.js   # 1 VU por 30 s
│   └── cenario-2.js   # carga progressiva com stages
└── evidencias/        # prints, JSONs e saídas de console
```

## Critérios de aprovação (thresholds)

| Critério | Limite |
|---|---|
| Tempo de resposta (p95), global e por rota | < 500 ms |
| Taxa de falhas HTTP | < 1% |
| Checks | 100% |

A justificativa desses valores e os resultados completos estão em [RELATORIO.md](RELATORIO.md).
