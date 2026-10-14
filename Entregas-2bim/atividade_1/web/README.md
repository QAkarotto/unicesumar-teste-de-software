## Atividade 01 – 2BIM: Automação de Testes de API com Playwright

**Dupla:** Luiz Francisco P. P. Neto e Gabriel Fernando C. Palomares (ESOFT6S - 2026)

### O que foi feito
- Configuração do Playwright com **TypeScript** (`package.json`, `playwright.config.ts`, `tsconfig.json`)
- Dois projetos no Playwright: **`api`** (`tests/api`) e **`web`** (`tests/web`, estrutura preparada para os próximos testes de interface)
- **13 testes de API** do ServeRest usando o `request` do Playwright, cobrindo `/usuarios`, `/login`, `/produtos` e `/carrinhos`
- Instruções de instalação e execução em [`TESTES.md`](./TESTES.md)

### Cobertura dos requisitos
| Requisito | Testes |
| --- | --- |
| Cenários de sucesso | CT01, CT03, CT06, CT08, CT12 |
| Cenários inválidos | CT04, CT05, CT07, CT09 |
| Regras de negócio | CT02 (e-mail único), CT10 (rota só para admin), CT11 (nome de produto único), CT12 (carrinho reserva e devolve estoque), CT13 (não exceder estoque) |
| Status HTTP + corpo da resposta | todos os testes validam o status **e** o corpo (mensagens, `_id`, campos, formato do token, totais do carrinho, estoque) |

Cada teste gera sua própria massa de dados (e-mails/nomes únicos), então os testes são independentes e não dependem de dados pré-existentes na API pública.

### Como executar
```bash
npm install
npx playwright test                 # todos os testes
npx playwright test --project=api   # apenas API (ou: npm run test:api)
npx playwright show-report          # relatório HTML
```

![evidencia1.png](../../../../../Downloads/evidencia1.png)

![evidencia2.png](../../../../../Downloads/evidencia2.png)