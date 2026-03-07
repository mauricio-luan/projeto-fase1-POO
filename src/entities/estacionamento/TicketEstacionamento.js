import { validate } from "bycontract";

export default class TicketEstacionamento {
  #placa;
  #tipoCliente;
  #dataHoraEntrada;
  #dataHoraSaida;
  #qtdDiasUso;

  constructor({ placa, tipoCliente, dataHoraEntrada = new Date() }) {
    validate(arguments[0], {
      placa: "String",
      tipoCliente: "String",
      dataHoraEntrada: "Date",
    });

    this.#placa = placa;
    this.#tipoCliente = tipoCliente;
    this.#dataHoraEntrada = dataHoraEntrada;
    this.#qtdDiasUso = 0;
    this.#dataHoraSaida = null;
  }

  get placa() {
    return this.#placa;
  }

  get tipoCliente() {
    return this.#tipoCliente;
  }

  get dataHoraEntrada() {
    return this.#dataHoraEntrada;
  }

  get dataHoraSaida() {
    return this.#dataHoraSaida;
  }

  get qtdDiasUso() {
    return this.#qtdDiasUso;
  }

  #calcularDiasUso() {
    const diaEntrada = new Date(this.#dataHoraEntrada).setHours(0, 0, 0, 0);
    const diaSaida = new Date(this.#dataHoraSaida).setHours(0, 0, 0, 0);
    const diffMilissegundos = diaSaida - diaEntrada;
    const diasPassados = diffMilissegundos / (1000 * 60 * 60 * 24);

    this.#qtdDiasUso = diasPassados + 1;
  }

  set dataHoraSaida(data) {
    validate(data, "Date");
    if (data < this.dataHoraEntrada)
      throw new Error("Data de saída não pode ser anterior à data de entrada.");

    this.#dataHoraSaida = data;
    this.#calcularDiasUso();
  }

  estaEmAberto() {
    return this.dataHoraEntrada && this.dataHoraSaida === null;
  }

  toString() {
    return (
      `TicketEstacionamento { ` +
      `placa: '${this.#placa}', ` +
      `tipoCliente: '${this.#tipoCliente}', ` +
      `dataHoraEntrada: ${this.#dataHoraEntrada.toISOString()}, ` +
      `dataHoraSaida: ${this.#dataHoraSaida ? this.#dataHoraSaida.toISOString() : null}, ` +
      `qtdDiasUso: ${this.#qtdDiasUso} }`
    );
  }
}
