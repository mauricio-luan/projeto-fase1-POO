import readline from "readline";
import Professor from "../../entities/cliente/Professor.js";
import Estudante from "../../entities/cliente/Estudante.js";
import Empresa from "../../entities/cliente/Empresa.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((r) => rl.question(q, r));

export default class Menu {
  #cadastrarCliente;
  #registroDeEntradasESaidas;
  #CSV;

  constructor(cadastroCliente, registroDeEntradasESaidas, CSV) {
    this.#cadastrarCliente = cadastroCliente;
    this.#registroDeEntradasESaidas = registroDeEntradasESaidas;
    this.#CSV = CSV;
  }

  async menu() {
    console.log(`
=== ESTACIONAMENTO ===
1. Cadastrar cliente
2. Listar clientes
3. Registrar entrada
4. Registrar saída
5. Ver pátio
6. Ver lista negra
0. Sair`);

    const op = (await ask("\nOpção: ")).trim();

    try {
      switch (op) {
        case "1":
          await this.cadastrar();
          break;
        case "2":
          this.listar();
          break;
        case "3":
          await this.entrada();
          break;
        case "4":
          await this.saida();
          break;
        case "5":
          this.verPatio();
          break;
        case "6":
          this.verListaNegra();
          break;
        case "0":
          await this.salvarClientesCSV();
          console.log("Encerrando.");
          rl.close();
          return;
        default:
          console.log("Opção inválida.");
      }
    } catch (e) {
      console.log(`Erro: ${e.message}`);
    }

    await this.menu();
  }

  async cadastrar() {
    const tipo = (
      await ask("Tipo (1-Estudante 2-Professor 3-Empresa): ")
    ).trim();
    const nome = (await ask("Nome: ")).trim();
    const doc = (await ask("Documento (CPF/CNPJ): ")).trim();
    const veiculos = (await ask("Placas (separadas por vírgula): "))
      .trim()
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    let cliente;
    switch (tipo) {
      case "1": {
        const saldo = parseFloat((await ask("Saldo inicial: ")).trim());
        cliente = new Estudante({ nome, documento: doc, veiculos, saldo });
        break;
      }
      case "2":
        cliente = new Professor({ nome, documento: doc, veiculos });
        break;
      case "3": {
        const debitos = parseFloat(
          (await ask("Débitos (padrão 0): ")).trim() || "0",
        );
        cliente = new Empresa({ nome, documento: doc, veiculos, debitos });
        break;
      }
      default:
        console.log("Tipo inválido.");
        return;
    }

    this.#cadastrarCliente.cadastrarCliente(cliente);
    console.log(`Cadastrado: ${cliente.toString()}`);
  }

  listar() {
    if (this.#cadastrarCliente.isEmpty()) {
      console.log("Nenhum cliente.");
      return;
    }
    this.#cadastrarCliente.clientes.forEach((c) =>
      console.log(`  ${c.toString()}`),
    );
  }

  async entrada() {
    const placa = (await ask("Placa: ")).trim();
    const ticket = this.#registroDeEntradasESaidas.registraEntrada(placa);
    console.log(`Entrada OK: ${ticket.toString()}`);
  }

  async saida() {
    const placa = (await ask("Placa: ")).trim();
    const cliente = this.#cadastrarCliente.obterClientePorPlaca(placa);
    let pgto = true;

    if (!cliente) {
      pgto =
        (await ask("Avulso — pagamento aprovado? (s/n): "))
          .trim()
          .toLowerCase() === "s";
    }

    const ticket = this.#registroDeEntradasESaidas.registraSaida(placa, pgto);
    console.log(`Saída OK: ${ticket.toString()}`);

    if (!cliente && !pgto)
      console.log(`Placa ${placa} adicionada à lista negra.`);
  }

  verPatio() {
    const p = this.#registroDeEntradasESaidas.patio;
    if (p.size === 0) {
      console.log("Pátio vazio.");
      return;
    }
    for (const [, t] of p) console.log(`  ${t.toString()}`);
  }

  verListaNegra() {
    const ln = this.#registroDeEntradasESaidas.listaNegra;
    if (ln.size === 0) {
      console.log("Lista negra vazia.");
      return;
    }
    for (const placa of ln) console.log(`  ${placa}`);
  }

  async salvarClientesCSV() {
    try {
      return await this.#CSV.geraCSV();
    } catch (e) {
      console.error("Erro ao salvar CSV:", e.message || e);
    }
  }
}
