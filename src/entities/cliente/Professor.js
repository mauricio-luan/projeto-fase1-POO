import { validate } from "bycontract";
import Cliente from "./Cliente.js";
import { TIPOS } from "../../constants.js";

/**
 * Classe que representa um cliente do tipo professor.
 * Permite até dois veículos e oferece acesso gratuito ao estacionamento.
 */
export default class Professor extends Cliente {
  constructor({ nome, documento, veiculos }) {
    if (veiculos.length > 2)
      throw new Error("Professores não podem possuir mais de dois veículos.");

    super({ nome, documento, tipo: TIPOS.PROFESSOR, veiculos });
  }

  cadastrarVeiculo(placa) {
    if (this.veiculos.length >= 2)
      throw new Error("Professores não podem possuir mais de dois veículos.");

    super.cadastrarVeiculo(placa);
  }

  calcularTarifa(ticket) {
    validate(ticket, "TicketEstacionamento");
    return 0;
  }
}
