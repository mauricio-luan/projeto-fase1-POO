import { validate } from "bycontract";
import Cliente from "./Cliente.js";
import { TARIFAS, TIPOS } from "../../constants.js";

/**
 * Classe que representa um cliente do tipo estudante.
 * Gerencia saldo de créditos e permite apenas um veículo.
 */
export default class Estudante extends Cliente {
  #saldo;

  /**
   * Cria um estudante.
   * @param {object} params
   * @param {string} params.nome - Nome do estudante.
   * @param {string} params.documento - CPF do estudante.
   * @param {string[]} params.veiculos - Placas associadas ao estudante.
   * @param {number} params.saldo - Saldo disponível para cobrança.
   */
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

  /**
   * Adiciona créditos ao saldo do estudante.
   * @param {number} valor - Valor a ser creditado.
   * @returns {void}
   */
  adicionaSaldo(valor) {
    validate(valor, "Number");
    if (this.creditosNegativos(valor))
      throw new Error("Valores de créditos negativos não permitidos.");
    this.#saldo += valor;
  }

  /**
   * Desconta um valor do saldo do estudante.
   * @param {number} valor - Valor a ser debitado.
   * @returns {number}
   */
  descontarSaldo(valor) {
    validate(valor, "Number");
    return (this.#saldo -= valor);
  }

  /**
   * Verifica se um valor de crédito é inválido.
   * @param {number} valor - Valor a ser validado.
   * @returns {boolean}
   */
  creditosNegativos(valor) {
    validate(valor, "Number");
    return valor < 0;
  }

  /**
   * Representação textual do estudante.
   * @returns {string}
   */
  toString() {
    return `${super.toString().slice(0, -2)}, saldo: R$ ${this.saldo.toFixed(2)} }`;
  }

  /**
   * Cadastra um veículo para o estudante, respeitando o limite de um veículo.
   * @param {string} placa - Placa do veículo.
   * @returns {void}
   */
  cadastrarVeiculo(placa) {
    if (this.veiculos.length >= 1)
      throw new Error("Estudantes não podem possuir mais de um veículo.");

    super.cadastrarVeiculo(placa);
  }

  /**
   * Calcula a tarifa devida por um estudante a partir do ticket.
   * @param {import("../estacionamento/TicketEstacionamento.js").default} ticket
   * @returns {number}
   */
  calcularTarifa(ticket) {
    if (ticket.qtdDiasUso === 1) return TARIFAS.FIXO_POR_INGRESSO;

    return TARIFAS.FIXO_POR_INGRESSO * ticket.qtdDiasUso;
  }
}
