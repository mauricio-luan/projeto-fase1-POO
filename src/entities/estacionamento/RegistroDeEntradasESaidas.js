import { validate } from "bycontract";
import { TIPOS } from "../../constants.js";
import TicketEstacionamento from "./TicketEstacionamento.js";
import Avulso from "../cliente/Avulso.js";
import CadastroCliente from "../cliente/CadastroCliente.js";

/**
 * Classe que gerencia entradas e saídas de veículos no estacionamento.
 * Valida acesso, emite tickets e controla lista negra de veículos.
 */
export default class RegistroDeEntradasESaidas {
  #clientes;
  #patio;
  #listaNegra;
  #historicoTickets;

  constructor(cadastroCliente) {
    this.#clientes = cadastroCliente;
    this.#patio = new Map();
    this.#listaNegra = new Set();
    this.#historicoTickets = [];
  }

  /**
   * Valida a entrada de um veículo no estacionamento.
   * @param {string} placa - A placa do veículo.
   * @returns {object|null} - O cliente associado à placa, se existir.
   * @throws {Error} - Se a entrada for inválida.
   */
  #validaEntrada(placa) {
    validate(placa, "String");

    if (this.#listaNegra.has(placa))
      throw new Error(`Veículo ${placa} na lista negra, acesso negado`);

    if (this.#patio.has(placa))
      throw new Error(`Veículo ${placa} já está no estacionamento`);

    const cliente = this.#clientes.obterClientePorPlaca(placa);
    if (cliente) {
      switch (cliente.tipo) {
        case TIPOS.ESTUDANTE:
          if (cliente.saldo < 0)
            throw new Error("Estudante com saldo negativo, acesso negado");
          break;

        case TIPOS.PROFESSOR:
          if (cliente.veiculos.some((v) => this.#patio.has(v)))
            throw new Error(
              "Professor com veículo já estacionado, acesso negado",
            );
          break;

        case TIPOS.EMPRESA:
          if (!cliente.estaAdimplente())
            throw new Error("Empresa inadimplente, acesso negado");
          break;
      }
    }
    return cliente;
  }

  /**
   * Registra a entrada de um veículo no estacionamento e adiciona ao registro de entradas e saídas.
   * @param {string} placa - A placa do veículo.
   * @returns {object} - O ticket de estacionamento gerado.
   */
  registraEntrada(placa) {
    validate(placa, "String");
    const cliente = this.#validaEntrada(placa);
    const tipo = cliente ? cliente.tipo : TIPOS.AVULSO;

    const ticket = new TicketEstacionamento({
      placa: placa,
      tipoCliente: tipo,
    });

    this.#patio.set(placa, ticket);
    this.#historicoTickets.push(ticket);
    return ticket;
  }

  /**
   * Registra a saída de um veículo do estacionamento.
   * @param {string} placa - A placa do veículo.
   * @param {boolean} pgtoAprovado - Indica se o pagamento foi aprovado.
   * @returns {object} - O ticket de estacionamento atualizado.
   */
  registraSaida(placa, pgtoAprovado) {
    validate(placa, "String");

    const ticket = this.#patio.get(placa);

    if (!ticket)
      throw new Error(`Veículo ${placa} não encontrado no estacionamento`);

    if (ticket.estaEmAberto()) {
      ticket.dataHoraSaida = new Date();
    }

    const cliente = this.#clientes.obterClientePorPlaca(placa);
    if (cliente) {
      const valorDevido = cliente.calcularTarifa(ticket);

      switch (cliente.tipo) {
        case TIPOS.ESTUDANTE:
          cliente.descontarSaldo(valorDevido);
          ticket.valorCobrado = valorDevido;
          break;

        case TIPOS.EMPRESA:
          cliente.imputarDebito(valorDevido);
          ticket.valorCobrado = valorDevido;
          break;

        case TIPOS.PROFESSOR:
          break;
      }
    } else {
      const clienteAvulso = new Avulso({ veiculos: [placa] });
      const valorDevido = clienteAvulso.calcularTarifa(ticket);
      ticket.valorCobrado = valorDevido;

      if (!pgtoAprovado) this.#listaNegra.add(placa);
    }

    this.#patio.delete(placa);
    return ticket;
  }

  get patio() {
    return new Map(this.#patio);
  }

  get listaNegra() {
    return new Set(this.#listaNegra);
  }

  get historicoTicketsToJSON() {
    return this.#historicoTickets.map((ticket) => ({
      placa: ticket.placa,
      tipoCliente: ticket.tipoCliente,
      dataHoraEntrada: ticket.dataHoraEntrada,
      ...(ticket.dataHoraSaida ? { dataHoraSaida: ticket.dataHoraSaida } : {}),
      ...(ticket.qtdDiasUso ? { qtdDiasUso: ticket.qtdDiasUso } : {}),
      ...(ticket.valorCobrado ? { valorCobrado: ticket.valorCobrado } : {}),
    }));
  }
}
