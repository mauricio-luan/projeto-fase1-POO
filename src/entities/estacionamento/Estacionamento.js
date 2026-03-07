import { validate } from "bycontract";
import TicketEstacionamento from "./TicketEstacionamento";
import Avulso from "../cliente/Avulso";
import { TIPOS } from "../../constants";

export default class Estacionamento {
  #patio;
  #clientes;
  #listaNegra;

  constructor(cadastroClientes) {
    this.#patio = new Map();
    this.#clientes = cadastroClientes; //csv com os clientes
    this.#listaNegra = new Set();
  }

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

  registraEntrada(placa) {
    validate(placa, "String");
    const cliente = this.#validaEntrada(placa);
    const tipo = cliente ? cliente.tipo : TIPOS.AVULSO;

    const ticket = new TicketEstacionamento({
      placa: placa,
      tipoCliente: tipo,
    });

    this.#patio.set(placa, ticket);
    return ticket;
  }

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
          break;

        case TIPOS.EMPRESA:
          cliente.imputarDebito(valorDevido);
          break;

        case TIPOS.PROFESSOR:
          break;
      }
    } else {
      const clienteAvulso = new Avulso({ veiculos: [placa] });
      const valorDevido = clienteAvulso.calcularTarifa(ticket);

      if (!pgtoAprovado) this.#listaNegra.add(placa);
    }

    this.#patio.delete(placa);
    return ticket;
  }
}
