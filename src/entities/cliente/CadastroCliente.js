import { validate } from "bycontract";
import Cliente from "./Cliente.js";

/**
 * Classe que gerencia o registro e armazenamento de clientes.
 * Fornece operações de CRUD para clientes identificados por documento.
 */
export default class CadastroCliente {
  #clientes;

  constructor() {
    this.#clientes = new Map();
  }

  cadastrarCliente(cliente) {
    validate(cliente, Cliente);
    this.#clientes.set(cliente.documento, cliente);
    return true;
  }

  excluirCliente(documentoCliente) {
    validate(documentoCliente, "String");
    if (!this.#clientes.has(documentoCliente))
      throw new Error("Cliente não encontrado");

    this.#clientes.delete(documentoCliente);
    return true;
  }

  getCliente(documentoCliente) {
    return this.#clientes.get(documentoCliente);
  }

  /**
   * Obtém um cliente com base na placa do veículo.
   * @param {string} placa - A placa do veículo.
   * @returns {Object|null} - O cliente associado à placa, se existir.
   */
  obterClientePorPlaca(placa) {
    validate(placa, "String");
    for (const cliente of this.clientes) {
      if (cliente.veiculos.includes(placa)) {
        return cliente;
      }
    }
    return null;
  }

  get clientes() {
    return Array.from(this.#clientes.values());
  }

  get qtdClientes() {
    return this.#clientes.size;
  }

  isEmpty() {
    return this.#clientes.size === 0;
  }
}
