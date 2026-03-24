import { validate } from "bycontract";
import Cliente from "./Cliente.js";
import { TARIFAS, TIPOS } from "../../constants.js";

/**
 * Classe que representa um cliente do tipo estudante.
 * Gerencia saldo de créditos e permite apenas um veículo.
 */
export default class Estudante extends Cliente {
  #saldo;

  constructor({ nome, documento, veiculos, saldo }) {
    validate(saldo, "Number");

    if (veiculos.length > 1)
      throw new Error("Estudantes não podem possuir mais de um veículo.");

    super({ nome, documento, tipo: TIPOS.ESTUDANTE, veiculos });

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

  descontarSaldo(valor) {
    validate(valor, "Number");
    return (this.#saldo -= valor);
  }

  creditosNegativos(valor) {
    validate(valor, "Number");
    return valor < 0;
  }

  toString() {
    return `${super.toString().slice(0, -2)}, saldo: R$ ${this.saldo.toFixed(2)} }`;
  }

  cadastrarVeiculo(placa) {
    if (this.veiculos.length >= 1)
      throw new Error("Estudantes não podem possuir mais de um veículo.");

    super.cadastrarVeiculo(placa);
  }

  calcularTarifa(ticket) {
    if (ticket.qtdDiasUso === 1) return TARIFAS.FIXO_POR_INGRESSO;

    return TARIFAS.FIXO_POR_INGRESSO * ticket.qtdDiasUso;
  }
}
