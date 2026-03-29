# Sistema de Controle de Estacionamento

Projeto da disciplina de POO para simular o controle de um estacionamento com clientes cadastrados e avulsos.

O sistema trabalha com:

- cadastro de clientes
- entrada e saída de veículos
- cobrança por tipo de cliente
- bloqueio de placas
- persistência em CSV
- relatórios gerenciais

## Tipos de cliente

- Estudante
- Professor
- Empresa
- Avulso

Cada tipo possui regras próprias de acesso e cobrança.

## O que o projeto faz

- cadastra clientes com documento e placa
- controla veículos no pátio
- registra tickets com data e hora de entrada e saída
- calcula valor cobrado conforme a regra de negócio
- bloqueia placas na lista negra quando necessário
- carrega dados dos arquivos CSV na inicialização
- salva os dados atualizados em CSV ao encerrar

## Relatórios

O projeto possui suporte para relatórios de:

- arrecadação por período
- situação de cliente cadastrado
- histórico de estacionamento por cliente cadastrado
- histórico de estacionamento por cliente avulso
- lista negra
- top 10 clientes mais frequentes

## Estrutura

```text
src/
  entities/
    cliente/
    csv/
    estacionamento/
    menu/
    relatorio/
database/
  clientes.CSV
  historico_tickets.CSV
  lista_negra.CSV
app.js
```

## Como rodar

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
node app.js
```

## Tecnologias

- JavaScript
- Node.js (24.14)
- bycontract

## Observação

Os dados usados pelo sistema ficam na pasta `database/`. Os arquivos CSV são lidos na inicialização e salvos novamente ao fim da execução.
