# Atividade 05 – 2º BIM: Testes de desempenho com k6 no ServeRest

Material da atividade: pesquisa, scripts k6, execução local e modelo de relatório. Perfis limitados a 1 VU por 30 s e até 10 VUs, com pausa entre iterações. Os scripts recusam qualquer destino remoto: use somente o ServeRest local.

## Conteúdo

- relatorio.md: pesquisa, critérios dos thresholds, metodologia, tabela de resultados e conclusão.
- k6/carga-inicial.js: cenário 1 (1 VU por 30 s).
- k6/carga-progressiva.js: cenário 2 (1 → 5 → 10 → 5 → 0 VUs).
- k6/common.js: validação da URL local, GETs e checks compartilhados.
- scripts/executar.ps1: roda os dois cenários e salva logs e sumários em JSON.

## Preparação (Windows PowerShell)

1. Instale o Node.js e o k6 conforme as fontes oficiais no relatório. No Windows, a documentação k6 indica: winget install k6 --source winget.
2. Em um primeiro terminal, inicie o ServeRest local na porta 3000:

   npx serverest@latest

   Alternativa oficial via Docker:

   docker run --rm -p 3000:3000 paulogoncalvesbh/serverest:latest

3. Confirme http://localhost:3000/status e verifique que /produtos e /usuarios retornam HTTP 200.
4. Em outro terminal, na pasta do trabalho, execute:

   .\scripts\executar.ps1

   Para configurar outro endereço local:

   .\scripts\executar.ps1 -BaseUrl http://127.0.0.1:3000

   O destino aceita somente localhost, 127.0.0.1 ou ::1. Não use serverest.dev. O script encontra o k6 no PATH ou em C:\Program Files\k6\k6.exe.
5. Os arquivos resultados/cenario-1.log, resultados/cenario-2.log e sumários .json são evidências geradas pela execução. Transcreva os valores reais em relatorio.md.

O primeiro npx pode baixar o pacote do ServeRest. A instalação do k6 é separada. Não há dependências JavaScript adicionais no projeto.

## Perfil e volume controlado

Cada iteração consulta GET /produtos e GET /usuarios sequencialmente e aguarda 1 s. Cada VU produz até cerca de 2 req/s se as respostas forem rápidas; o cenário progressivo tem limite de 10 VUs, aproximadamente 20 req/s. O valor real depende da latência porque ramping-vus modela usuários em ciclo fechado. Não é teste de estresse.

## Fontes principais

- Documentação k6: https://grafana.com/docs/k6/latest/
- ServeRest oficial: https://github.com/ServeRest/ServeRest
- Documentação das rotas: https://serverest.dev/
