const repo = require('../repositories/clientes.repo');

async function listarClientes() { return repo.listar(); }
async function obterCliente(id) { return repo.buscarPorId(id); }
async function criarCliente(dados) { return repo.inserir(dados); }
async function atualizarCliente(id, dados) { return repo.atualizar(id, dados); }
async function desativarCliente(id) { return repo.desativar(id); }

module.exports = {
  listarClientes, obterCliente, criarCliente, atualizarCliente, desativarCliente
};
