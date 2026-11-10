# GUIA DETALHADO — ATIVIDADE 05: TESTES DE DESEMPENHO COM k6 NO SERVEREST

Este guia explica o que fazer desde a preparação do computador até a abertura do Pull Request. Os testes devem rodar somente em uma instância local do ServeRest.

## 1. Entenda o que será entregue

A atividade tem quatro partes:
1. Pesquisa: responder os conceitos de desempenho, VUs, checks, thresholds e métricas.
2. Ambiente: iniciar o ServeRest localmente e instalar o k6.
3. Implementação: executar os scripts para `GET /produtos` e `GET /usuarios` em dois cenários.
4. Análise: comparar os dados realmente medidos e explicar o que aconteceu.

A pasta do projeto já contém os scripts, a pesquisa e um modelo de relatório. Você ainda precisa executar os testes e preencher as lacunas com os resultados do seu computador. Não é correto inventar números ou prints.

## 2. Preparação do computador

### 2.1 Instalar ou conferir o Node.js

A alternativa NPM do ServeRest precisa do Node.js. Abra o PowerShell e digite:

```powershell
node --version
npm --version
```

Se aparecerem números de versão, as ferramentas estão disponíveis. Se o Windows disser que o comando não é reconhecido, instale o Node.js pela página oficial e abra um novo terminal.

### 2.2 Iniciar o ServeRest local

Você pode usar NPM ou Docker. Escolha apenas uma opção.

**Opção A — NPM**

1. Abra o VS Code.
2. Abra um terminal: menu `Terminal` > `New Terminal`.
3. Execute:

```powershell
npx serverest@latest
```

4. Se o terminal perguntar se deseja instalar o pacote, confirme conforme a mensagem apresentada.
5. Aguarde a mensagem de que o servidor está escutando na porta 3000.
6. Não feche esse terminal enquanto estiver testando.

**Opção B — Docker**

1. Confirme que o Docker Desktop está aberto e funcionando.
2. Abra um terminal.
3. Execute:

```powershell
docker run --rm -p 3000:3000 paulogoncalvesbh/serverest:latest
```

4. Aguarde o contêiner iniciar.
5. Mantenha o terminal aberto durante os testes.

Se a porta 3000 já estiver ocupada, não encerre processos desconhecidos. Identifique primeiro qual aplicação está usando a porta. Se optar por outra porta, ajuste o mapeamento do Docker e passe a URL local correspondente com `-e BASE_URL=...`.

### 2.3 Conferir a API

Abra o navegador e acesse:

- `http://localhost:3000`
- `http://localhost:3000/status`

A página `/status` deve apresentar informações de funcionamento da instância. Se não abrir:
- confirme se o terminal do ServeRest continua em execução;
- confira se a URL e a porta estão corretas;
- verifique se o Docker está ativo, caso tenha escolhido essa opção;
- leia a mensagem de erro no terminal do servidor.

Não prossiga até conseguir acessar a API local.

### 2.4 Instalar e conferir o k6

Siga a instalação oficial para o Windows: https://grafana.com/docs/k6/latest/set-up/install-k6/

Depois da instalação:
1. Feche e abra novamente o PowerShell ou o terminal do VS Code.
2. Execute:

```powershell
k6 version
```

Se aparecer a versão, a instalação foi reconhecida. Se `k6` não for reconhecido, confira a instalação e se o diretório do executável foi incluído no PATH do Windows.

## 3. Abrir o projeto no VS Code

1. Baixe e extraia `atividade05-k6-serverest.zip`.
2. No VS Code, clique em `File` > `Open Folder`.
3. Selecione a pasta `atividade05-k6-serverest` que foi extraída.
4. No Explorer, confira se aparecem `README.md`, `pesquisa-k6.md`, `tests`, `relatorio` e `evidencias`.
5. Abra `tests/carga-inicial.js` e `tests/carga-progressiva.js` para visualizar os scripts.

Não é necessário executar `npm install` para o k6: ele executa os arquivos JavaScript diretamente.

## 4. Entenda os scripts

### 4.1 URL configurável

Os scripts definem a URL base assim:

```javascript
const BASE_URL = (__ENV.BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
```

Isso significa:
- se você não informar variável, será usado `http://localhost:3000`;
- se informar `BASE_URL`, o script usará esse endereço;
- a validação logo abaixo aceita somente `http://localhost` ou `http://127.0.0.1`, com porta opcional.

Essa proteção evita executar acidentalmente a carga em um servidor remoto. Não remova essa validação e não use `https://serverest.dev`.

### 4.2 Requisições e checks

Cada iteração:
1. faz `http.get()` em `/produtos`;
2. verifica se o status é 200;
3. faz `http.get()` em `/usuarios`;
4. verifica se o status é 200;
5. aguarda 1 segundo antes da próxima iteração.

O `check` registra se a condição foi verdadeira. Ele não substitui os thresholds.

### 4.3 Thresholds

Os scripts usam:
- `http_req_duration: ['p(95)<1000']`: p95 menor que 1000 milissegundos;
- `http_req_failed: ['rate<0.01']`: menos de 1% de requisições classificadas como falha;
- `checks: ['rate>0.99']`: mais de 99% dos checks aprovados.

São limites didáticos escolhidos para esta atividade, não garantias de desempenho do ServeRest. Um threshold reprovado significa que o limite escolhido não foi alcançado naquela execução.

## 5. Executar o Cenário 1 — carga inicial

Objetivo: observar o comportamento básico com apenas um usuário virtual.

1. Deixe o ServeRest ativo.
2. Abra um segundo terminal no VS Code.
3. Confirme que o terminal está na pasta raiz do projeto.
4. Execute:

```powershell
k6 run --summary-export=evidencias/cenario1-summary.json tests/carga-inicial.js
```

O cenário tem:
- 1 VU;
- 30 segundos;
- duas requisições por iteração;
- pausa de 1 segundo entre iterações.

Ao terminar, o k6 mostra um resumo no terminal. Observe principalmente:
- `http_reqs`: quantidade total de requisições;
- `http_reqs/s`: média de requisições por segundo;
- `http_req_duration`: média, mediana, máximo e p95;
- `http_req_failed`: taxa de falhas;
- `checks`: quantidade e taxa de verificações aprovadas;
- resultado dos thresholds.

Faça uma captura de tela mostrando o comando e o resumo final. Salve como `evidencias/cenario1-terminal.png`. O comando também deve criar `evidencias/cenario1-summary.json`.

## 6. Executar o Cenário 2 — carga progressiva

Objetivo: observar o comportamento quando a concorrência aumenta gradualmente, sem realizar teste de estresse.

1. Confirme que o ServeRest continua ativo.
2. No segundo terminal, execute:

```powershell
k6 run --summary-export=evidencias/cenario2-summary.json tests/carga-progressiva.js
```

O script define quatro estágios de 30 segundos:
- 30 s chegando a 1 VU;
- 30 s aumentando até 5 VUs;
- 30 s aumentando até 10 VUs;
- 30 s reduzindo até 0 VUs.

Duração planejada: 120 segundos. O k6 ajusta gradualmente o número de VUs durante cada estágio; os valores-alvo não significam que o teste permanece todo o estágio no número máximo.

Faça uma captura do resumo final e salve como `evidencias/cenario2-terminal.png`. O JSON será salvo em `evidencias/cenario2-summary.json`.

## 7. Como registrar os resultados

Abra `relatorio/relatorio-resultados.md` e substitua cada `[preencher]` pelos valores que aparecem no resumo do k6.

### Onde encontrar cada indicador

| O que o relatório pede | Onde olhar no resumo |
|---|---|
| VUs | Configuração do script; no progressivo, pico de 10 VUs |
| Duração | `30s` no cenário 1; `120s` planejados no cenário 2 |
| Total de requisições | `http_reqs` |
| Requisições por segundo | valor entre parênteses em `http_reqs` ou taxa da métrica |
| Média | `http_req_duration` → `avg` |
| p95 | `http_req_duration` → `p(95)` |
| Taxa de falhas | `http_req_failed` → `...%` |
| Checks | `checks` → aprovados/total e percentual |
| Thresholds | seção ` thresholds` / mensagens de threshold no resumo |

Atenção: o total de checks é maior que o total de requisições porque cada iteração faz dois checks, um para cada endpoint. O total de requisições também inclui as duas chamadas por iteração.

### Conversão de unidades

O k6 normalmente exibe duração em milissegundos (`ms`). Mantenha a unidade indicada no relatório. Se algum valor for apresentado em segundos, multiplique por 1000 para converter em milissegundos.

### Se um threshold falhar

Não altere o resultado para parecer aprovado. Registre:
- qual threshold falhou;
- o valor observado;
- o limite configurado;
- uma possível explicação, identificando-a como hipótese.

## 8. Como fazer a comparação técnica

Use os dados reais para responder:

1. O total de requisições aumentou no cenário progressivo?
2. O RPS aumentou na mesma proporção dos VUs?
3. A média e o p95 aumentaram, diminuíram ou ficaram semelhantes?
4. Houve aumento de falhas?
5. Os checks continuaram aprovados?
6. Quais thresholds foram aprovados ou reprovados?

Exemplo de estrutura de análise — substitua pelas suas observações:

> No cenário inicial, com 1 VU, foram realizadas [valor] requisições, com média de [valor] ms e p95 de [valor] ms. No cenário progressivo, com pico de 10 VUs, foram realizadas [valor] requisições, com média de [valor] ms e p95 de [valor] ms. Isso mostra que [descrever a mudança observada]. A taxa de falhas foi [valor] e os checks [foram/não foram] aprovados. Portanto, os dados indicam [conclusão limitada aos resultados].

Não escreva que a API ficou mais lenta se os números não mostrarem isso. Não atribua a causa ao banco de dados, memória ou rede sem evidência.

## 9. Limitações que precisam aparecer no relatório

- É um teste local; não representa automaticamente o comportamento em produção.
- O computador executa o cliente k6 e o servidor ServeRest, podendo ser limitado por CPU e memória.
- Outros programas abertos podem influenciar o resultado.
- Foram avaliados apenas dois endpoints GET.
- A pausa de 1 segundo limita o ritmo de cada VU.
- O p95 descreve a distribuição de latência, mas não explica sozinho a causa de atrasos.
- A quantidade de dados retornados e a versão da API também podem influenciar.
- Os resultados de uma execução podem variar; repetições em condições semelhantes ajudam a avaliar consistência.

## 10. Preparar a entrega no GitHub

Siga o padrão de branch definido pelo professor. Se não houver um padrão, um exemplo é `feature/atividade-05-k6`.

1. Abra o terminal na pasta do repositório clonado da disciplina.
2. Confira a branch e as alterações:

```bash
git status
git branch
```

3. Crie a branch (somente se ainda não estiver nela):

```bash
git switch -c feature/atividade-05-k6
```

4. Copie os arquivos e pastas do projeto para dentro do repositório da disciplina, respeitando a estrutura solicitada.
5. Confira o que será enviado:

```bash
git status
```

6. Adicione os arquivos da atividade:

```bash
git add README.md pesquisa-k6.md tests/ relatorio/ evidencias/
```

Se a atividade estiver dentro de uma subpasta do repositório, use o caminho dessa subpasta no `git add`.
7. Crie o commit:

```bash
git commit -m "Adiciona atividade 05 de testes com k6"
```

8. Envie a branch:

```bash
git push -u origin feature/atividade-05-k6
```

9. No GitHub, abra o repositório e clique em `Compare & pull request` ou em `Pull requests` > `New pull request`.
10. Confira:
    - base: branch de destino indicada pelo professor;
    - compare: sua branch com a atividade;
    - arquivos alterados: somente os arquivos esperados.
11. Use o título `Atividade 05 - Testes de desempenho com k6`.
12. Na descrição, explique brevemente que foram adicionados a pesquisa, os dois cenários, instruções, evidências e relatório.
13. Clique em `Create pull request`.

## 11. Checklist final antes de entregar

- [ ] ServeRest executado localmente.
- [ ] `http://localhost:3000/status` acessível.
- [ ] k6 instalado e versão conferida.
- [ ] Cenário 1 executado e resumo salvo.
- [ ] Cenário 2 executado e resumo salvo.
- [ ] Capturas de tela reais salvas na pasta `evidencias`.
- [ ] Relatório preenchido com os dados medidos.
- [ ] Análise compara os dois cenários sem inventar causas.
- [ ] Pesquisa e referências incluídas.
- [ ] Arquivos commitados e enviados para a branch correta.
- [ ] Pull Request aberto para a branch de destino correta.
