# Atividade 4

**Alunos:**
- Luis Estevam Sinegoski
- Milena Swierk Medeiros Santos

## Testes:

Foi implementado os seguintes testes:
- **Cadastro e autenticação de usuário**
- **Cadastro de produto com administrador**
- **Autenticação com credenciais inválidas**

Os tres cenários se encontram na pasta `/tests` na pasta `/atividade4`.

Além disso, também foi implementado a fixture `contaAdmin.fixture.ts` para usar uma pagina autenticada com uma conta administrador no segundo cenário

## Execução dos testes:

Para executar os testes é necessario instalar as dependencias:

```bash
npm install
```

E depois executar eles com o seguinte comando:
```bash
npx playwright test
```