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
}
