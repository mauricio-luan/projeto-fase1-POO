import CadastroCliente from "./src/entities/cliente/CadastroCliente.js";
import RegistroDeEntradasESaidas from "./src/entities/estacionamento/RegistroDeEntradasESaidas.js";
import TicketEstacionamento from "./src/entities/estacionamento/TicketEstacionamento.js";
import CSV from "./src/entities/csv/CSV.js";
import Menu from "./src/entities/menu/Menu.js";
import Empresa from "./src/entities/cliente/Empresa.js";
import Professor from "./src/entities/cliente/Professor.js";
import Estudante from "./src/entities/cliente/Estudante.js";
import { TIPOS } from "./src/constants.js";

async function main() {
  const cadastroCliente = new CadastroCliente();
  const estacionamento = new RegistroDeEntradasESaidas(cadastroCliente);
  const csv = new CSV(cadastroCliente, estacionamento);
  const menu = new Menu(cadastroCliente, estacionamento, csv);

  const clientesDoCsv = await csv.getCSVClientes();
  const historicoTicketsDoCsv = await csv.getCSVHistoricoTickets();

  setClientes(cadastroCliente, clientesDoCsv);
  setTickets(estacionamento, historicoTicketsDoCsv);
  await menu.menu();
}

function setClientes(cadastroCliente, listaClientesCSV) {
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

function setTickets(estacionamento, historicoTicketsDoCsv) {
  if (!historicoTicketsDoCsv || historicoTicketsDoCsv.length === 0) return;

  historicoTicketsDoCsv.forEach((linha) => {
    const [
      placa,
      tipoCliente,
      dataHoraEntrada,
      dataHoraSaida,
      qtdDiasUso,
      valorCobrado,
    ] = linha.trim().split(",");

    const ticket = new TicketEstacionamento({
      placa,
      tipoCliente,
      dataHoraEntrada: new Date(dataHoraEntrada),
    });

    if (dataHoraSaida) {
      ticket.dataHoraSaida = new Date(dataHoraSaida);
    }

    if (qtdDiasUso) {
      ticket.qtdDiasUso = parseInt(qtdDiasUso, 10);
    }

    if (valorCobrado) {
      ticket.valorCobrado = parseFloat(valorCobrado);
    }

    if (ticket.estaEmAberto()) {
      estacionamento.reinsereTicketEmAberto(ticket);
    }
    estacionamento.historicoTickets = ticket;
  });
}

main();
