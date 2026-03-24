import { validate } from "bycontract";

/**
 * Classe que representa um ticket de estacionamento.
 * Registra entrada, saída e tempo de permanência de um veículo.
 */
export default class TicketEstacionamento {
  #placa;
  #tipoCliente;
  #dataHoraEntrada;
  #dataHoraSaida;
  #qtdDiasUso;
  #valorCobrado;

  constructor({ placa, tipoCliente, dataHoraEntrada = new Date() }) {
    validate(arguments[0], {
      placa: "String",
      tipoCliente: "String",
    });

    this.#placa = placa;
    this.#tipoCliente = tipoCliente;
    this.#dataHoraEntrada = dataHoraEntrada;
    this.#qtdDiasUso = null;
    this.#dataHoraSaida = null;
    this.#valorCobrado = 0;
  }

  get placa() {
    return this.#placa;
  }

  get tipoCliente() {
    return this.#tipoCliente;
  }

  get dataHoraEntrada() {
    return new Date(this.#dataHoraEntrada);
  }

  get dataHoraSaida() {
    return this.#dataHoraSaida ? new Date(this.#dataHoraSaida) : null;
  }

  get qtdDiasUso() {
    return this.#qtdDiasUso;
  }

  /**
   * Calcula a quantidade de dias de uso do estacionamento com base nas datas de entrada e saída.
   */
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
      `placa: '${this.placa}', ` +
      `tipoCliente: '${this.tipoCliente}', ` +
      `dataHoraEntrada: ${this.dataHoraEntrada.toISOString()}, ` +
      `dataHoraSaida: ${this.dataHoraSaida ? this.dataHoraSaida.toISOString() : null}, ` +
      `qtdDiasUso: ${this.qtdDiasUso}, ` +
      `valorCobrado: R$ ${(this.valorCobrado ? this.valorCobrado : 0).toFixed(2)} }`
    );
  }

  get valorCobrado() {
    return this.#valorCobrado;
  }

  set valorCobrado(valor) {
    validate(valor, "Number");
    if (valor < 0) throw new Error("Valor cobrado não pode ser negativo.");
    this.#valorCobrado = valor;
  }
}
