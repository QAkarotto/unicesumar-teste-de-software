# Atividade 05 - Testes de Desempenho com k6 no ServeRest

## 1. Respostas da Pesquisa (Parte 1)
1. **Finalidade dos testes de desempenho e diferença para os funcionais:** Os testes de desempenho avaliam a velocidade, estabilidade, escalabilidade e responsividade de um sistema sob carga. Enquanto os testes funcionais validam regras de negócio e requisitos (o *quê* o sistema faz), os testes de desempenho medem o comportamento sob estresse e concorrência (*como* o sistema se comporta).
2. **Usuários Virtuais (VUs):** São instâncias executadas pelo k6 que emulam usuários reais acessando a aplicação simultaneamente. Quanto mais VUs ativas, maior é a carga de requisições enviadas ao servidor.
3. **Checks vs. Thresholds:** Os *checks* realizam validações pontuais por requisição (ex: status 200), cujas falhas individuais não abortam o teste. Já os *thresholds* são critérios de aceitação globais (ex: p95 < 200ms) que determinam a aprovação ou reprovação do teste.
4. **Métricas Principais:** 
   - `http_req_duration`: Tempo total de resposta da requisição.
   - `http_req_failed`: Taxa de falhas nas requisições.
   - `http_reqs`: Volume total de requisições e taxa por segundo.
5. **Importância do Percentil 95 (p95):** Indica que 95% de todas as requisições obtiveram um tempo de resposta igual ou inferior àquele valor, eliminando picos isolados (outliers) e refletindo a experiência real da maioria dos usuários.

---

## 2. Scripts de Testes de Desempenho (Parte 3)
O script utilizado (`loadtest.js`) contempla os dois cenários solicitados utilizando `stages`, validações (`checks`), critérios de desempenho (`thresholds`) e parametrização de URL:

*(O código em JavaScript do seu arquivo `loadtest.js` fica salvo aqui na raiz do repositório)*

---

## 3. Instruções de Configuração e Execução (Parte 2)
Para configurar e executar os testes localmente:

1. **Subir a API ServeRest localmente (via Docker ou NPM):**
   ```powershell
   docker run -p 3000:3000 paulogoncalvesbh/serverest:latest