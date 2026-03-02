import { validate } from "bycontract";
import { Cliente } from "./Cliente";

export class Estudante extends Cliente {
  #saldo;

  constructor({ nome, documento, veiculos, saldo }) {
    super({ nome, documento, tipo: "Estudante", veiculos });

    validate(saldo, "Number");
    this.#saldo = saldo;
  }

  get saldo() {
    return this.#saldo;
  }

  set saldo(valor) {
    validate(valor, "Number");
    this.#saldo += valor;
  }
}
