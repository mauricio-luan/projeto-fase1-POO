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

  /**
   * Cria uma empresa cliente do estacionamento.
   * @param {object} params
   * @param {string} params.nome - Razão social ou nome da empresa.
   * @param {string} params.documento - CNPJ da empresa.
   * @param {string[]} params.veiculos - Placas vinculadas à empresa.
   * @param {number} [params.debitos=0] - Débito acumulado da empresa.
   */
  constructor({ nome, documento, veiculos, debitos = 0 }) {
    super({ nome, documento, tipo: TIPOS.EMPRESA, veiculos });

    validate(debitos, "Number");
    this.#debitos = debitos;
    this.#adimplente = this.#debitos === 0;
  }

  get debitos() {
    return this.#debitos;
  }

  get adimplente() {
    return this.#adimplente;
  }

  /**
   * Indica se a empresa está adimplente.
   * @returns {boolean}
   */
  estaAdimplente() {
    return this.#adimplente;
  }

  /**
   * Imputa um novo débito à empresa.
   * @param {number} valor - Valor a ser adicionado ao débito.
   * @returns {void}
   */
  imputarDebito(valor) {
    validate(valor, "Number");
    if (valor < 0) throw new Error("Valor de débito não pode ser negativo.");
    this.#debitos += valor;
    this.#adimplente = false;
  }

  /**
   * Abate um pagamento do débito atual.
   * @param {number} pagamento - Valor pago pela empresa.
   * @returns {number|void}
   */
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

  /**
   * Representação textual da empresa.
   * @returns {string}
   */
  toString() {
    return `${super.toString().slice(0, -2)}, debitos: ${this.debitos}, adimplente: ${this.estaAdimplente()} }`;
  }

  /**
   * Calcula a tarifa devida por uma empresa a partir do ticket.
   * @param {import("../estacionamento/TicketEstacionamento.js").default} ticket
   * @returns {number}
   */
  calcularTarifa(ticket) {
    if (ticket.qtdDiasUso > 1) {
      return (
        TARIFAS.DIARIA * ticket.qtdDiasUso + TARIFAS.MULTA * ticket.qtdDiasUso
      );
    }
    return TARIFAS.DIARIA * ticket.qtdDiasUso;
  }
}
