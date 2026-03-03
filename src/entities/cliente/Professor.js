import Cliente from "./Cliente.js";

export default class Professor extends Cliente {
  constructor({ nome, documento, veiculos }) {
    if (veiculos.length > 2)
      throw new Error("Professores não podem possuir mais de dois veículos.");

    super({ nome, documento, tipo: "Professor", veiculos });
  }

  cadastrarVeiculo(placa) {
    if (this.veiculos.length >= 2)
      throw new Error("Professores não podem possuir mais de dois veículos.");

    super.cadastrarVeiculo(placa);
  }
}
