import { validate } from "bycontract";
import Cliente from "./Cliente.js";

export default class CadastroCliente {
  #clientes;

  constructor() {
    this.#clientes = [];
  }

  cadastrarCliente(cliente) {
    validate(cliente, Cliente);
    this.#clientes.push(cliente);
    return true;
  }

  excluirCliente(documentoCliente) {
    validate(documentoCliente, Cliente);
    const index = this.#clientes.findIndex(
      (c) => c.documento === documentoCliente,
    );
    if (index === -1) throw new Error("Cliente não encontrado");

    this.#clientes.splice(index, 1);
    return true;
  }

  cliente(documentoCliente) {
    return this.#clientes.find((c) => c.documento === documentoCliente);
  }

  get clientes() {
    return this.#clientes;
  }

  get qtdClientes() {
    return this.#clientes.length;
  }

  isEmpty() {
    return this.#clientes.length === 0;
  }
}
