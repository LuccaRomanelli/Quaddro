## Desafio Proposto

O objetivo consiste em:
Escreva uma aplicação usando React com Typescript que permita criar e listar
agendamentos. Um agendamento deve possuir:

- Título
- Horário e dia de início
- Horário e dia de fim
  Deve ser possível ordenar a lista por título, horário de início ou fim.
  Um agendamento não pode:
- Ter horário de fim menor que o horário de início.
  Ex: Começar no dia 19/02 às 14:00 e terminar no dia 19/02 às 13:30
- Acontecer no mesmo horário que outro agendamento
  Ex: Existe um agendamento começando no dia 19/02 às 14:00 e terminando às 14:15.
  Não deve ser possível criar outro agendamento começando às 14:10 e terminando às
  14:20.
  Não se preocupe com a aparência, foque na organização dos componentes e do
  código.

## Abordagem tomada

Para concluir o desafio foi utilizado o framework next.js, como o criterio não era para se utilizar um backend propriamente dito utilizei tudo em um component simples que faz tudo.
Utilizei as libs MouseEventHandler, useCallback, useState do react, useForm do react-hook-form e para manejar o tempo foi usado o moment.

## Ver o resultado em "produção"

Abra [https://quaddro-lucca.vercel.app/](https://quaddro-lucca.vercel.app/) no browser para ver o resultado.

## Rodando o projeto localmente

Para rodar o projeto localmente basta clonar o repositorio dar o comando:

```bash
npm install
```

Depois o comando

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no browser para ver o resultado.
