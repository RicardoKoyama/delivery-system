const repo = require('../repositories/enderecos.repo');

async function listarEnderecos(clienteId) { return repo.listarPorCliente(clienteId); }
async function criarEndereco(clienteId, d) { return repo.inserir(clienteId, d); }
async function atualizarEndereco(id, d) { return repo.atualizar(id, d); }
async function excluirEndereco(id) { return repo.desativar(id); }
async function definirPrincipal(clienteId, enderecoId) {
  await repo.definirPrincipal(clienteId, enderecoId);
}
async function obterEndereco(id) { return repo.buscarPorId(id); }

module.exports = {
  listarEnderecos, criarEndereco, atualizarEndereco,
  excluirEndereco, definirPrincipal, obterEndereco
};
