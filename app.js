import CadastroCliente from "./src/entities/cliente/CadastroCliente.js";
import Professor from "./src/entities/cliente/Professor.js";
import Estudante from "./src/entities/cliente/Estudante.js";
import Empresa from "./src/entities/cliente/Empresa.js";

try {
  const mauricio = new Estudante({
    nome: "mauricio",
    documento: "01861192088",
    saldo: 360,
    veiculos: ["ABDS-0452"],
  });

  const thaina = new Professor({
    nome: "thaina",
    documento: "99961192088",
    veiculos: ["ABDS-0452", "ABDS-0453"],
  });

  const enterprise = new Empresa({
    nome: "Enterprise",
    documento: "12345678000195",
    veiculos: ["ENT-0001", "ENT-0002", "ENT-0003"],
    debitos: 5000,
  });

  console.log(mauricio.toString());
  console.log(thaina.toString());
  console.log(enterprise.toString());
} catch (error) {
  console.error(error);
}
