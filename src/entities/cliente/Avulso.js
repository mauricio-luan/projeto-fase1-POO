import { validate } from "bycontract";
import { TARIFAS } from "../../constants.js";

/**
 * Classe que representa um cliente avulso.
 * Calcula tarifa conforme horas ou dias de permanência.
 */
export default class Avulso {
  #veiculos;

  /**
   * Cria um cliente avulso.
   * @param {object} params
   * @param {string[]} params.veiculos - Veículos usados no acesso avulso.
   */
  constructor({ veiculos }) {
    validate(veiculos, "Array.<String>");
    this.#veiculos = [...veiculos];
  }

  /**
   * Calcula a tarifa de um ticket avulso com base no tempo de permanência.
   * @param {import("../estacionamento/TicketEstacionamento.js").default} ticket
   * @returns {number}
   */
  calcularTarifa(ticket) {
    if (ticket.qtdDiasUso > 1) {
      return ticket.qtdDiasUso * TARIFAS.DIARIA;
    }

    const qtdHoras = Math.ceil(
      (ticket.dataHoraSaida - ticket.dataHoraEntrada) / (1000 * 60 * 60),
    );

    if (qtdHoras <= 6) {
      return TARIFAS.FIXO_POR_HORA * qtdHoras;
    }

    return TARIFAS.DIARIA;
  }
}
