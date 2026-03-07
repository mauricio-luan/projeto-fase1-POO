import { validate } from "bycontract";

export default class Cliente {
  #nome;
  #documento;
  #tipo;
  #veiculos;

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

  toString() {
    return `Cliente { nome: '${this.#nome}', documento: '${this.#documento}', tipo: '${this.#tipo}', veiculos: ${JSON.stringify(this.veiculos)} }`;
  }

  validaDocumento(doc) {
    const formattedDoc = doc.replace(/[^0-9]/g, "");
    return formattedDoc.length === 11 || formattedDoc.length === 14;
  }

  cadastrarVeiculo(placa) {
    validate(placa, "String");
    if (this.#veiculos.has(placa)) {
      throw new Error("Veículo já cadastrado para este cliente.");
    }
    this.#veiculos.add(placa);
    return true;
  }

  removerVeiculo(placa) {
    validate(placa, "String");
    if (!this.#veiculos.has(placa)) {
      throw new Error("Veículo não encontrado para este cliente.");
    }
    this.#veiculos.delete(placa);
    return true;
  }

  calcularTarifa(ticket) {}
}
