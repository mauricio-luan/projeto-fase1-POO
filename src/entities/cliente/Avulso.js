import { validate } from "bycontract";
import { TARIFAS } from "../../constants";

export default class Avulso {
  #veiculos;

  constructor({ veiculos }) {
    validate(veiculos, "Array.<String>");
    this.#veiculos = [...veiculos];
  }

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
