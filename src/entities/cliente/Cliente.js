import { validate } from "bycontract";

/**
 * Classe base que representa um cliente do estacionamento.
 * Armazena dados pessoais, documento e veículos registrados.
 */
export default class Cliente {
  #nome;
  #documento;
  #tipo;
  #veiculos;

  /**
   * Cria um cliente base.
   * @param {object} params
   * @param {string} params.nome - Nome completo do cliente.
   * @param {string} params.documento - CPF ou CNPJ do cliente.
   * @param {string} params.tipo - Categoria do cliente no sistema.
   * @param {string[]} params.veiculos - Lista de placas vinculadas ao cliente.
   */
  constructor({ nome, documento, tipo, veiculos }) {
    validate(arguments[0], {
      nome: "String",
      documento: "String",
      tipo: "String",
      veiculos: "Array.<String>",
    });

    this.#nome = nome;
    this.#tipo = tipo;
    this.#veiculos = new Set(veiculos);

    if (!this.validaDocumento(documento)) {
      throw new Error("Documento inválido.");
    } else {
      this.#documento = documento;
    }
  }

  get nome() {
    return this.#nome;
  }

  get documento() {
    return this.#documento;
  }

  get tipo() {
    return this.#tipo;
  }

  get veiculos() {
    return Array.from(this.#veiculos);
  }

  /**
   * Representação textual do cliente.
   * @returns {string}
   */
  toString() {
    return `Cliente { nome: '${this.#nome}', documento: '${this.#documento}', tipo: '${this.#tipo}', veiculos: ${JSON.stringify(this.veiculos)} }`;
  }

  /**
   * Valida o documento do cliente.
   * @param {string} doc - O documento a ser validado.
   * @returns {boolean} - Retorna true se o documento for válido, caso contrário, false.
   */
  validaDocumento(doc) {
    const formattedDoc = doc.replace(/[^0-9]/g, "");
    return formattedDoc.length === 11 || formattedDoc.length === 14;
  }

  /**
   * Associa um novo veículo ao cliente.
   * @param {string} placa - Placa do veículo.
   * @returns {boolean}
   */
  cadastrarVeiculo(placa) {
    validate(placa, "String");
    if (this.#veiculos.has(placa)) {
      throw new Error("Veículo já cadastrado para este cliente.");
    }
    this.#veiculos.add(placa);
    return true;
  }

  /**
   * Remove um veículo já cadastrado do cliente.
   * @param {string} placa - Placa do veículo.
   * @returns {boolean}
   */
  removerVeiculo(placa) {
    validate(placa, "String");
    if (!this.#veiculos.has(placa)) {
      throw new Error("Veículo não encontrado para este cliente.");
    }
    this.#veiculos.delete(placa);
    return true;
  }

  /**
   * Calcula a tarifa do estacionamento com base no ticket fornecido.
   * @param {import("../estacionamento/TicketEstacionamento.js").default} ticket - O ticket de estacionamento.
   * @returns {number} - A tarifa calculada.
   */
  calcularTarifa(ticket) {}
}
