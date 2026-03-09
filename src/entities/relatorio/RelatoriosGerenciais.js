import { validate } from "bycontract";

export default class RelatoriosGerenciais {
  #registroEntradasESaidas;
  #registroClientes;

  constructor(registroEntradasESaidas, registroClientes) {
    this.#registroEntradasESaidas = registroEntradasESaidas;
    this.#registroClientes = registroClientes;
  }

  geraRelatorioEntradasESaidas() {}

  geraRelatorioClientes() {}

  // 1. Valor total arrecadado por período (e opcionalmente categoria)
  geraRelatorioArrecadacao(dataInicial, dataFinal, tipoCliente = null) {}

  // 2. Situação de um cliente cadastrado (veículos lá dentro e saldo/débito)
  geraSituacaoClienteCadastrado(identificador) {} // Pode ser o CPF/CNPJ

  // 3. Registros de estacionamento de um cliente cadastrado em determinado período
  geraHistoricoClienteCadastrado(identificador, dataInicial, dataFinal) {}

  // 4. Registros de estacionamento de um cliente não cadastrado (Avulso) em determinado período
  geraHistoricoClienteAvulso(placa, dataInicial, dataFinal) {}

  // 5. Relação dos clientes impedidos de entrar no estacionamento
  geraRelatorioListaNegra() {}

  // 6. Relação dos 10 clientes mais frequentes do ano
  geraTop10ClientesFrequentes(ano) {}
}
