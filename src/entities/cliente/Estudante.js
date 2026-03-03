import { validate } from "bycontract";
import Cliente from "./Cliente.js";

export default class Estudante extends Cliente {
  #saldo;

  constructor({ nome, documento, veiculos, saldo }) {
    if (veiculos.length > 1)
      throw new Error("Estudantes não podem possuir mais de um veículo.");
    
    super({ nome, documento, tipo: "Estudante", veiculos });
    
    validate(saldo, "Number");
    if (this.creditosNegativos(saldo))
      throw new Error("Valores de créditos negativos não permitidos.");
    this.#saldo = saldo;
  }

  get saldo() {
    return this.#saldo;
  }

  adicionaSaldo(valor) {
    validate(valor, "Number");
    if (this.creditosNegativos(valor))
      throw new Error("Valores de créditos negativos não permitidos.");
    this.#saldo += valor;
  }

  creditosNegativos(valor) {
    validate(valor, "Number");
    return valor < 0;
  }

  toString() {
    return `${super.toString().slice(0, -2)}, saldo: ${this.saldo} }`;
  }

  cadastrarVeiculo(placa) {
    if (this.veiculos.length >= 1)
      throw new Error("Estudantes não podem possuir mais de um veículo.");

    super.cadastrarVeiculo(placa);
  }
}
