import { validate } from "bycontract";
import Cliente from "./Cliente.js";

/**
 * Classe que gerencia o registro e armazenamento de clientes.
 * Fornece operações de CRUD para clientes identificados por documento.
 */
export default class CadastroCliente {
  #clientes;

  /**
   * Cria o repositório em memória de clientes.
   */
  constructor() {
    this.#clientes = new Map();
  }

  /**
   * Obtém um cliente com base na placa do veículo.
   * @param {string} placa - A placa do veículo.
   * @returns {Cliente|null} - O cliente associado à placa, se existir.
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

  /**
   * Lista de clientes cadastrados.
   * @returns {Cliente[]}
   */
  get clientes() {
    return Array.from(this.#clientes.values());
  }

  /**
   * Quantidade total de clientes cadastrados.
   * @returns {number}
   */
  get qtdClientes() {
    return this.#clientes.size;
  }

  /**
   * Serializa os clientes para um formato simples, apropriado para persistência.
   * @returns {object[]}
   */
  clientesToJSON() {
    return Array.from(this.#clientes.values()).map((cliente) => ({
      nome: cliente.nome,
      documento: cliente.documento,
      tipo: cliente.tipo,
      veiculos: cliente.veiculos,
      ...(cliente.saldo !== undefined ? { saldo: cliente.saldo } : {}),
      ...(cliente.debitos !== undefined ? { debitos: cliente.debitos } : {}),
      ...(cliente.adimplente !== undefined
        ? { adimplente: cliente.adimplente }
        : {}),
    }));
  }

  /**
   * Cadastra um cliente usando o documento como chave única.
   * @param {Cliente} cliente - Instância do cliente a ser armazenada.
   * @returns {boolean}
   */
  cadastrarCliente(cliente) {
    validate(cliente, Cliente);
    this.#clientes.set(cliente.documento, cliente);
    return true;
  }

  /**
   * Exclui um cliente pelo documento.
   * @param {string} documentoCliente - CPF ou CNPJ do cliente.
   * @returns {boolean}
   */
  excluirCliente(documentoCliente) {
    validate(documentoCliente, "String");
    if (!this.#clientes.has(documentoCliente))
      throw new Error("Cliente não encontrado");

    this.#clientes.delete(documentoCliente);
    return true;
  }

  /**
   * Recupera um cliente pelo documento.
   * @param {string} documentoCliente - CPF ou CNPJ do cliente.
   * @returns {Cliente|undefined}
   */
  getCliente(documentoCliente) {
    return this.#clientes.get(documentoCliente);
  }

  /**
   * Indica se não há clientes cadastrados.
   * @returns {boolean}
   */
  isEmpty() {
    return this.#clientes.size === 0;
  }
}
