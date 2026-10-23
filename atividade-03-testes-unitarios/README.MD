
# Atividade 03 - Testes Unitários com Test Doubles

Testes unitários desenvolvidos sobre o serviço de usuários do ServeRest, utilizando Mocha, Chai e Sinon.

## Instalação

Na raiz do projeto, executar:

```bash
npm install
```

## Execução

Para executar os testes unitários:

```bash
npm run test:unit
```

## Organização

- `src/services/usuarios-service.js`: serviço de usuários do ServeRest.
- `src/utils/alterarValoresParaRegex.js`: função auxiliar utilizada pelo serviço.
- `test/unit/usuarios-service-doubles.test.js`: testes unitários com Test Doubles.
- `test/unit/.mocharc.js`: configuração do Mocha.

## Testes

Foram implementados 8 testes unitários, contemplando consultas, cadastro, exclusão e atualização de usuários.

Os testes utilizam stub, spy e mock para substituir dependências e verificar comportamentos sem utilizar um banco de dados real.

## Referência

Código-fonte baseado no projeto ServeRest:

https://github.com/ServeRest/ServeRest

Os arquivos reutilizados do ServeRest mantêm sua origem e estão sujeitos à licença do projeto original.
