import { validate } from "bycontract";
import Cliente from "./Cliente.js";
import { TARIFAS, TIPOS } from "../../constants.js";

/**
 * Classe que representa um cliente do tipo empresa.
 * Gerencia débitos e adimplência da empresa.
 */
export default class Empresa extends Cliente {
  #debitos;
  #adimplente;

  constructor({ nome, documento, veiculos, debitos = 0 }) {
    super({ nome, documento, tipo: TIPOS.EMPRESA, veiculos });

    validate(debitos, "Number");
    this.#debitos = debitos;
    this.#adimplente = this.#debitos === 0;
  }

  get debitos() {
    return this.#debitos;
  }

  estaAdimplente() {
    return this.#adimplente;
  }

  imputarDebito(valor) {
    validate(valor, "Number");
    if (valor < 0) throw new Error("Valor de débito não pode ser negativo.");
    this.#debitos += valor;
    this.#adimplente = false;
  }

  quitarDebitos(pagamento) {
    validate(pagamento, "Number");
    if (pagamento < 0)
      throw new Error("Valor de pagamento não pode ser negativo.");

    if (pagamento > this.debitos) {
      throw new Error(
        "O valor do pagamento não pode ser maior que o débito atual.",
      );
    }

    if (pagamento === this.debitos) {
      this.#debitos = 0;
      this.#adimplente = true;
      return;
    }

    this.#debitos -= pagamento;
    return this.debitos;
  }

  toString() {
    return `${super.toString().slice(0, -2)}, debitos: ${this.debitos}, adimplente: ${this.estaAdimplente()} }`;
  }

  calcularTarifa(ticket) {
    if (ticket.qtdDiasUso > 1) {
      return (
        TARIFAS.DIARIA * ticket.qtdDiasUso + TARIFAS.MULTA * ticket.qtdDiasUso
      );
    }
    return TARIFAS.DIARIA * ticket.qtdDiasUso;
  }
}
