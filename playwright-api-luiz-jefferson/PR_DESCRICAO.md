## Atividade 02 — Evolução da Suíte de Testes de API com Playwright

**Integrantes:** Luiz Gustavo Becher Bolzani e Jefferson Luis Namur Junior.

### Melhorias realizadas
- Centralização de `baseURL`, timeout e reporter no Playwright.
- Separação entre cenários (`tests/api`), helpers, fixture e factories.
- Reutilização de autenticação com token Bearer e usuário administrador.
- Faker para nomes, e-mails e produtos únicos.
- Testes independentes com preparação e limpeza dos recursos.
- Asserções de status, mensagens, IDs, dados persistidos e regras de negócio.
- 12 cenários cobrindo login, usuários e produtos.
- README com comandos de instalação e execução.

### Execução
```bash
npm install
npx playwright test tests/api
```

### Evidência da execução completa
**ANEXAR AQUI:** captura real do terminal com os testes executados e o resultado final. Não preencher com resultado presumido.
