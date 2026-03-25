import { validate } from "bycontract";
import Cliente from "./Cliente.js";
import { TIPOS } from "../../constants.js";

/**
 * Classe que representa um cliente do tipo professor.
 * Permite até dois veículos e oferece acesso gratuito ao estacionamento.
 */
export default class Professor extends Cliente {
  /**
   * Cria um professor.
   * @param {object} params
   * @param {string} params.nome - Nome do professor.
   * @param {string} params.documento - CPF do professor.
   * @param {string[]} params.veiculos - Placas associadas ao professor.
   */
  constructor({ nome, documento, veiculos }) {
    if (veiculos.length > 2)
      throw new Error("Professores não podem possuir mais de dois veículos.");

    super({ nome, documento, tipo: TIPOS.PROFESSOR, veiculos });
  }

  /**
   * Cadastra um veículo para o professor, respeitando o limite de dois veículos.
   * @param {string} placa - Placa do veículo.
   * @returns {void}
   */
  cadastrarVeiculo(placa) {
    if (this.veiculos.length >= 2)
      throw new Error("Professores não podem possuir mais de dois veículos.");

    super.cadastrarVeiculo(placa);
  }

  /**
   * Calcula a tarifa devida por um professor.
   * @param {import("../estacionamento/TicketEstacionamento.js").default} ticket
   * @returns {number}
   */
  calcularTarifa(ticket) {
    return 0;
  }
}
