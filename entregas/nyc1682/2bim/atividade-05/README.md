# Atividade 05 — 2º BIM: Testes de Desempenho com k6 no ServeRest

- [Respostas da pesquisa](pesquisa.md)
- [Script dos dois cenários](testes/desempenho.js)
- [Relatório comparativo](relatorio.md)
- [Evidências das execuções](evidencias/)

## Preparação

É necessário ter Node.js e npm instalados. No Windows, instale o k6 conforme a [documentação oficial](https://grafana.com/docs/k6/latest/set-up/install-k6/):

```powershell
winget install k6 --source winget
k6 version
```

Se necessário, reabra o terminal após a instalação. Nas execuções entregues foi utilizado o binário oficial portátil do [k6 2.3.0 para Windows amd64](https://github.com/grafana/k6/releases/download/v2.3.0/k6-v2.3.0-windows-amd64.zip), extraído e incluído no PATH da sessão.

Em um terminal, inicie o ServeRest local usando a mesma versão da execução:

```powershell
npx --yes serverest@3.2.2 --nodoc
```

Mantenha esse terminal aberto. A versão foi fixada para permitir a reprodução; o comando documentado `npx serverest@latest` instala a versão mais recente. A opção `--nodoc` apenas impede que o navegador abra automaticamente.

Em outro terminal, confirme a API e consulte o status:

```powershell
Invoke-WebRequest http://localhost:3000
Invoke-WebRequest http://localhost:3000/status
```

Ambas as páginas devem responder HTTP 200. Os testes de carga devem ocorrer exclusivamente em ambiente local, conforme as [instruções do ServeRest](https://github.com/ServeRest/ServeRest#teste-de-carga). O script rejeita endereços que não sejam `http://localhost` ou `http://127.0.0.1`, com porta opcional.

## Execução

Na pasta desta atividade, execute os cenários separadamente. Os comandos abaixo sobrescrevem as evidências correspondentes com os resultados da nova execução.

```powershell
New-Item -ItemType Directory -Force evidencias
k6 run --quiet --summary-export evidencias/cenario-1.json -e PERFIL=inicial -e BASE_URL=http://localhost:3000 testes/desempenho.js 2>&1 | Tee-Object evidencias/cenario-1.txt
```

Após o término do primeiro cenário:

```powershell
k6 run --quiet --summary-export evidencias/cenario-2.json -e PERFIL=progressivo -e BASE_URL=http://localhost:3000 testes/desempenho.js 2>&1 | Tee-Object evidencias/cenario-2.txt
```

A variável `BASE_URL` permite mudar a porta ou o endereço local sem alterar a lógica. A variável `PERFIL` seleciona o cenário. Os scripts são executados pelo k6, não pelo Node.js.

## Perfis

| Cenário | Configuração |
|---|---|
| Inicial | 1 VU durante 30 segundos |
| Progressivo | 10 s com 1 VU; 20 s de 1 a 5; 20 s de 5 a 10; 10 s com 10; 10 s de 10 a 5; 10 s de 5 a 0 |

Cada iteração consulta `GET /produtos` e `GET /usuarios`, com pausa de 1 segundo após cada requisição. O status esperado é HTTP 200. A duração programada do cenário progressivo é 80 segundos; a conclusão de iterações em andamento pode prolongar a execução. Não são realizados testes de estresse.

Os resumos TXT e JSON contêm as métricas, os checks e os thresholds. Os arquivos `cenario-1-execucao.txt` e `cenario-2-execucao.txt` registram os horários e códigos de saída das execuções entregues. O ambiente e a confirmação da API estão em `evidencias/ambiente.txt` e `evidencias/status.txt`.

Ao finalizar os testes, encerre o ServeRest com `Ctrl+C` no terminal em que ele foi iniciado.

Referência: [Execução de testes com k6](https://grafana.com/docs/k6/latest/get-started/running-k6/).
