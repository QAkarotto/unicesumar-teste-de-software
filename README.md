# Atividade 05 — Testes de Desempenho com k6 no ServeRest

Projeto da atividade de testes de desempenho do 2º bimestre. Os testes consultam `GET /produtos` e `GET /usuarios` usando k6.

> **Segurança e responsabilidade:** execute exclusivamente contra uma instância local do ServeRest. Os scripts bloqueiam URLs diferentes de `http://localhost[:porta]` e `http://127.0.0.1[:porta]`. Não use `https://serverest.dev`.

## Guia passo a passo

Consulte também [`GUIA-DETALHADO.md`](GUIA-DETALHADO.md), com instruções detalhadas para Windows/VS Code, execução, leitura das métricas, análise e Pull Request.

## Estrutura

```text
atividade05-k6-serverest/
├── README.md
├── pesquisa-k6.md
├── tests/
│   ├── carga-inicial.js
│   └── carga-progressiva.js
├── relatorio/
│   └── relatorio-resultados.md
└── evidencias/
    └── README.md
```

## 1. Preparar o ServeRest local

Escolha **uma** alternativa.

### NPM

Instale Node.js previamente e execute em um terminal:

```bash
npx serverest@latest
```

### Docker

Com Docker instalado e em execução:

```bash
docker run --rm -p 3000:3000 paulogoncalvesbh/serverest:latest
```

Mantenha esse terminal aberto. Em outro terminal ou navegador, confirme:

- API: http://localhost:3000
- Status: http://localhost:3000/status

A página `/status` ajuda a observar CPU, memória, tempo de resposta e RPS da instância local.

## 2. Instalar o k6

Siga a página oficial de instalação para seu sistema operacional:
https://grafana.com/docs/k6/latest/set-up/install-k6/

No Windows, uma opção documentada é usar o gerenciador de pacotes disponível no computador. Depois, confirme no PowerShell:

```powershell
k6 version
```

Não é necessário executar `npm install` neste projeto: o k6 executa os arquivos JavaScript diretamente.

## 3. Executar os cenários

Abra o terminal na pasta raiz deste projeto.

### Cenário 1 — Carga inicial

```powershell
k6 run --summary-export=evidencias/cenario1-summary.json tests/carga-inicial.js
```

### Cenário 2 — Carga progressiva

```powershell
k6 run --summary-export=evidencias/cenario2-summary.json tests/carga-progressiva.js
```

Por padrão, os scripts usam `http://localhost:3000`. Para apontar para outra porta local, sem editar o código:

```powershell
k6 run -e BASE_URL=http://localhost:3001 tests/carga-inicial.js
```

A validação interna rejeita endereços que não sejam localhost ou 127.0.0.1.

## 4. Evidências

1. Abra `http://localhost:3000/status` antes da execução e registre a tela.
2. Execute o cenário 1 e capture o terminal com o resumo final do k6.
3. Execute o cenário 2 e capture o terminal com o resumo final do k6.
4. Registre também o status da instância local durante ou logo após cada cenário, se possível.
5. Salve as imagens nesta pasta `evidencias/`, por exemplo:
   - `status-local.png`
   - `cenario1-terminal.png`
   - `cenario2-terminal.png`

Os arquivos `cenario1-summary.json` e `cenario2-summary.json` são gerados pelos comandos acima. Não invente nem preencha métricas sem executar os testes.

## 5. Relatório

Preencha `relatorio/relatorio-resultados.md` com os valores reais apresentados pelo k6. Compare principalmente total de requisições, RPS, média, p95, falhas, checks e thresholds.

## 6. Git e Pull Request

Na pasta do repositório da disciplina, copie os arquivos deste projeto para a branch solicitada pelo professor. Exemplo de comandos (ajuste o nome da branch e o caminho do repositório conforme a orientação da disciplina):

```bash
git status
git switch -c feature/atividade-05-k6
git add README.md pesquisa-k6.md tests/ relatorio/ evidencias/
git commit -m "Adiciona testes de desempenho com k6"
git push -u origin feature/atividade-05-k6
```

Depois, no GitHub:
1. Abra o repositório da disciplina.
2. Clique em **Compare & pull request** (ou **New pull request**).
3. Confira a branch de origem e a branch de destino exigidas pelo professor.
4. Crie o Pull Request com um título claro, por exemplo: `Atividade 05 - Testes de desempenho com k6`.
5. Inclua no PR um resumo dos dois cenários e confirme que adicionou as evidências e o relatório preenchido.

> Se o professor exigir um padrão específico de nome de branch, use o padrão da disciplina em vez do exemplo acima.
