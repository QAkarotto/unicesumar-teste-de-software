# Atividade 05 — Testes de desempenho com k6 no ServeRest

Gustavo Santana Barbosa e Lorenzo Rupel Bobeck.

Entrega baseada no commit `68862e7` da [PR #260](https://github.com/QAkarotto/unicesumar-teste-de-software/pull/260).

- [Respostas da pesquisa e fontes oficiais](PESQUISA.md).
- [Relatório comparativo e conclusão](RELATORIO.md).
- [Evidências de ambiente](evidencias/ambiente.txt), [cenário 1](evidencias/cenario-1.txt) e [cenário 2](evidencias/cenario-2.txt).

## Preparar o ambiente

Instale Node.js com npm para a alternativa NPM e o k6 conforme a [documentação oficial](https://grafana.com/docs/k6/latest/set-up/install-k6/). No macOS:

```bash
brew install k6
k6 version
```

No Windows, a documentação também apresenta `winget install k6 --source winget`. Para Linux, siga os comandos específicos da distribuição na referência acima. O k6 executa JavaScript com suas próprias APIs; os testes não são executados com `node` e não precisam de `npm install` nesta pasta.

Em um terminal separado, inicie a API:

```bash
npx serverest@latest
```

Para reproduzir a versão usada nas evidências, utilize `npx --yes serverest@3.2.2`. Alternativa com Docker (escolha apenas uma):

```bash
docker run --rm -p 127.0.0.1:3000:3000 paulogoncalvesbh/serverest:latest
```

Confira `http://localhost:3000` (documentação interativa) e `http://localhost:3000/status` (painel local de CPU, memória, tempo de resposta e RPS). A disponibilidade também pode ser verificada pelo terminal:

```bash
curl -I http://localhost:3000
curl -I http://localhost:3000/status
curl http://localhost:3000/produtos
curl http://localhost:3000/usuarios
```

A API deve responder HTTP 200. As [instruções oficiais do ServeRest](https://github.com/ServeRest/ServeRest#teste-de-carga) exigem execução de carga exclusivamente local. Os scripts rejeitam URLs externas e desabilitam redirecionamentos. Não use a API pública como alvo.

## Executar os cenários

A partir da raiz do repositório:

```bash
cd atividades/2bim/atividade-05-Solucao
k6 run cenario-1.js
k6 run cenario-2.js
```

Execute um cenário por vez, mantendo a mesma instância e os mesmos dados. A URL padrão é `http://localhost:3000`. Para alterar host/porta sem editar a lógica:

```bash
k6 run -e BASE_URL=http://127.0.0.1:3000 cenario-1.js
k6 run -e BASE_URL=http://127.0.0.1:3000 cenario-2.js
```

São aceitos apenas HTTP com `localhost`, `127.0.0.1` ou `[::1]`, com porta opcional. O k6 é executado no host; a alternativa Docker acima é para o ServeRest.

| Perfil | Configuração |
| --- | --- |
| Cenário 1 | 1 VU constante durante 30 s |
| Cenário 2 | Início com 1 VU; 10 s em 1; 15 s até 5; 15 s até 10; 10 s em 10; 10 s até 5; 10 s até 0. Total: 70 s |

Os `stages` do cenário 2 definem transições graduais, não saltos imediatos. Ambos executam `http.get()` em `/produtos` e `/usuarios`, validam HTTP 200 e a lista/quantidade do JSON, e usam `sleep(1)` por iteração. Há até 10 s para concluir iterações já iniciadas no encerramento; no cenário 2 também na redução de VUs. O timeout por requisição é de 5 s. Não aumente os perfis para testes de estresse.

Os critérios iguais para os dois perfis são p95 < 500 ms global e por endpoint, falhas HTTP < 1% e checks = 100%. A justificativa está no relatório.

## Registrar novas evidências

Para manter as evidências entregues, salve uma nova execução em outra pasta. Em Bash/zsh:

```bash
mkdir -p resultados-locais
k6 run --quiet --no-color --summary-export=resultados-locais/cenario-1.json cenario-1.js > resultados-locais/cenario-1.txt 2>&1
codigo=$?
echo "exit_code=$codigo" >> resultados-locais/cenario-1.txt
cat resultados-locais/cenario-1.txt

k6 run --quiet --no-color --summary-export=resultados-locais/cenario-2.json cenario-2.js > resultados-locais/cenario-2.txt 2>&1
codigo=$?
echo "exit_code=$codigo" >> resultados-locais/cenario-2.txt
cat resultados-locais/cenario-2.txt
```

O código de saída do k6 deve ser zero para aprovação; consulte os erros/thresholds se for diferente. O redirecionamento registra o console completo sem mascarar o código com `tee`. Os JSONs contêm métricas agregadas verificáveis; não são séries temporais. O `--summary-export` está disponível na versão registrada em `ambiente.txt`.

Ao terminar, encerre a API com `Ctrl+C`. Fontes adicionais: [execução do k6](https://grafana.com/docs/k6/latest/get-started/running-k6/), [variáveis de ambiente](https://grafana.com/docs/k6/latest/using-k6/environment-variables/) e [ramping-vus](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-vus/).
