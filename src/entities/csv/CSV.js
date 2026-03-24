import fs from "node:fs/promises";
import path from "path";
import { TIPOS } from "../../constants.js";
import { validate } from "bycontract";

export default class CSV {
  #clientes;
  #historicoTickets;
  #caminhoCSV;
  #caminhoCSVHistoricoTickets;
  #csv;
  #csvHistoricoTickets;

  constructor(cadastroCliente, estacionamento) {
    this.#clientes = cadastroCliente;
    this.#historicoTickets = estacionamento;
    this.#caminhoCSV = path.resolve("./clientes.CSV");
    this.#caminhoCSVHistoricoTickets = path.resolve("./historico_tickets.CSV");
    this.#csv = "";
    this.#csvHistoricoTickets = "";
  }

  async getCSVClientes() {
    try {
      const csv = await fs.readFile(this.#caminhoCSV, "utf-8");
      if (!csv) return [];

      return csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
    } catch (error) {
      console.error("Erro ao ler CSV de clientes: ", error.message || error);
    }
  }

  async getCSVHistoricoTickets() {
    try {
      const csv = await fs.readFile(this.#caminhoCSVHistoricoTickets, "utf-8");
      if (!csv) return [];

      return csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
    } catch (error) {
      console.error(
        "Erro ao ler CSV histórico de tickets: ",
        error.message || error,
      );
    }
  }

  #populaCSVClientes() {
    const clientes = this.#clientes.clientesToJSON();
    let linha = null;

    for (const cliente of clientes) {
      linha = `${cliente.documento},${cliente.tipo},${cliente.nome},"${cliente.veiculos.join(";")}"`;

      if (cliente.tipo === TIPOS.EMPRESA) {
        linha += `,${cliente.debitos},${cliente.adimplente}`;
      }

      if (cliente.tipo === TIPOS.ESTUDANTE) {
        linha += `,${cliente.saldo}`;
      }

      this.#csv += `${linha}\n`;
    }
  }

  #populaCSVHistoricoTickets() {
    const tickets = this.#historicoTickets.historicoTicketsToJSON;
    let linha = "";

    for (const ticket of tickets) {
      const colunas = [
        ticket.placa,
        ticket.tipoCliente,
        ticket.dataHoraEntrada.toISOString(),
        ticket.dataHoraSaida ? ticket.dataHoraSaida.toISOString() : "",
        ticket.qtdDiasUso || "",
        ticket.valorCobrado ?? "",
      ];

      linha = `${colunas.join(",")}\n`;
      this.#csvHistoricoTickets += linha;
    }
  }

  #CSVEstaPreenchido() {
    return this.#csv !== "";
  }

  async geraCSV() {
    if (this.#CSVEstaPreenchido()) this.#csv += "\n";

    this.#populaCSVClientes();
    this.#populaCSVHistoricoTickets();

    try {
      await fs.writeFile(this.#caminhoCSV, this.#csv, "utf-8");
      await fs.writeFile(
        this.#caminhoCSVHistoricoTickets,
        this.#csvHistoricoTickets,
        "utf-8",
      );
      console.log(`CSV salvo em: ${this.#caminhoCSV}`);
      console.log(
        `CSV histórico de tickets salvo em: ${this.#caminhoCSVHistoricoTickets}`,
      );
      return true;
    } catch (e) {
      console.error("Erro ao salvar CSV:", e.message || e);
      throw e;
    }
  }
}
