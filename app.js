import readline from "readline";
import CadastroCliente from "./src/entities/cliente/CadastroCliente.js";
import Professor from "./src/entities/cliente/Professor.js";
import Estudante from "./src/entities/cliente/Estudante.js";
import Empresa from "./src/entities/cliente/Empresa.js";
import RegistroDeEntradasESaidas from "./src/entities/estacionamento/RegistroDeEntradasESaidas.js";
import CSV from "./src/entities/csv/CSV.js";
import { TIPOS } from "./src/constants.js";

async function main() {
  const cadastroCliente = new CadastroCliente();
  const estacionamento = new RegistroDeEntradasESaidas(cadastroCliente);
  const csv = new CSV(cadastroCliente, estacionamento);
  const clientesDoCsv = await csv.getCSVClientes();
  const historicoTicketsDoCsv = await csv.getCSVHistoricoTickets();

  await setClientes(cadastroCliente, clientesDoCsv);
  await setTickets(estacionamento, historicoTicketsDoCsv);
  await menu(cadastroCliente, estacionamento, csv);
}

async function setClientes(cadastroCliente, listaClientesCSV) {
  if (!listaClientesCSV || listaClientesCSV.length === 0) return;

  listaClientesCSV.forEach((linha) => {
    let novoCliente;
    const colunas = linha.split(",");

    const cliente = {
      nome: colunas[2],
      documento: colunas[0],
      tipo: colunas[1],
      veiculos: colunas[3].split(";").map((v) => v.replaceAll('"', "").trim()),
    };

    if (cliente.tipo === TIPOS.PROFESSOR) {
      novoCliente = new Professor({ ...cliente });
    }

    if (cliente.tipo === TIPOS.ESTUDANTE) {
      novoCliente = new Estudante({
        ...cliente,
        saldo: parseFloat(colunas[4]),
      });
    }

    if (cliente.tipo === TIPOS.EMPRESA) {
      novoCliente = new Empresa({
        ...cliente,
        debitos: parseFloat(colunas[4]),
        adimplente: colunas[5],
      });
    }

    cadastroCliente.cadastrarCliente(novoCliente);
  });
}

async function setTickets(estacionamento, historicoTicketsDoCsv) {
  const ticketsEmAberto = historicoTicketsDoCsv
    .filter((linha) => linha.split(",")[3] === "")
    .map((linha) => {
      const [placa, tipoCliente, dataHoraEntrada] = linha.trim().split(",");

      return {
        placa,
        tipoCliente,
        dataHoraEntrada: new Date(dataHoraEntrada),
      };
    });

  ticketsEmAberto.forEach((ticket) =>
    estacionamento.registraEntrada(ticket.placa),
  );
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((r) => rl.question(q, r));

async function menu(clientes, estacionamento, csv) {
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
        await cadastrar(clientes);
        break;
      case "2":
        listar(clientes);
        break;
      case "3":
        await entrada(estacionamento);
        break;
      case "4":
        await saida(clientes, estacionamento);
        break;
      case "5":
        verPatio(estacionamento);
        break;
      case "6":
        verListaNegra(estacionamento);
        break;
      case "0":
        await salvarClientesCSV(csv);
        console.log("Encerrando.");
        rl.close();
        return;
      default:
        console.log("Opção inválida.");
    }
  } catch (e) {
    console.log(`Erro: ${e.message}`);
  }

  await menu(clientes, estacionamento, csv);
}

async function cadastrar(clientes) {
  const tipo = (await ask("Tipo (1-Estudante 2-Professor 3-Empresa): ")).trim();
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

  clientes.cadastrarCliente(cliente);
  console.log(`Cadastrado: ${cliente.toString()}`);
}

function listar(clientes) {
  if (clientes.isEmpty()) {
    console.log("Nenhum cliente.");
    return;
  }
  clientes.clientes.forEach((c) => console.log(`  ${c.toString()}`));
}

async function entrada(estacionamento) {
  const placa = (await ask("Placa: ")).trim();
  const ticket = estacionamento.registraEntrada(placa);
  console.log(`Entrada OK: ${ticket.toString()}`);
}

async function saida(clientes, estacionamento) {
  const placa = (await ask("Placa: ")).trim();
  const cliente = clientes.obterClientePorPlaca(placa);
  let pgto = true;

  if (!cliente) {
    pgto =
      (await ask("Avulso — pagamento aprovado? (s/n): "))
        .trim()
        .toLowerCase() === "s";
  }

  const ticket = estacionamento.registraSaida(placa, pgto);
  console.log(`Saída OK: ${ticket.toString()}`);

  if (!cliente && !pgto)
    console.log(`Placa ${placa} adicionada à lista negra.`);
}

function verPatio(estacionamento) {
  const p = estacionamento.patio;
  if (p.size === 0) {
    console.log("Pátio vazio.");
    return;
  }
  for (const [, t] of p) console.log(`  ${t.toString()}`);
}

function verListaNegra(estacionamento) {
  const ln = estacionamento.listaNegra;
  if (ln.size === 0) {
    console.log("Lista negra vazia.");
    return;
  }
  for (const placa of ln) console.log(`  ${placa}`);
}

async function salvarClientesCSV(csv) {
  try {
    return await csv.geraCSV();
  } catch (e) {
    console.error("Erro ao salvar CSV:", e.message || e);
  }
}

main();
