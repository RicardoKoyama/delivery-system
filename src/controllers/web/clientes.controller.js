const clientesService = require('../../services/clientes.service');
const enderecosService = require('../../services/enderecos.service');

async function index(req, res) {
  const clientes = await clientesService.listarClientes();
  res.render('painel/clientes', { clientes });
}

async function detalhe(req, res) {
  const cliente = await clientesService.obterCliente(req.params.id);
  if (!cliente) return res.status(404).send('Cliente não encontrado');
  const enderecos = await enderecosService.listarEnderecos(req.params.id);
  res.render('painel/cliente_detalhe', { cliente, enderecos });
}

async function novo(req, res) {
  res.render('painel/cliente_novo');
}

async function salvar(req, res) {
  await clientesService.criarCliente(req.body);
  res.redirect('/clientes');
}

async function editar(req, res) {
  const cliente = await clientesService.obterCliente(req.params.id);
  res.render('painel/cliente_editar', { cliente });
}

async function atualizar(req, res) {
  await clientesService.atualizarCliente(req.params.id, req.body);
  res.redirect('/clientes');
}

async function excluir(req, res) {
  await clientesService.desativarCliente(req.params.id);
  res.redirect('/clientes');
}

async function novoEndereco(req, res) {
  res.render('painel/endereco_novo', { clienteId: req.params.id });
}

async function salvarEndereco(req, res) {
  await enderecosService.criarEndereco(req.params.id, req.body);
  res.redirect(`/clientes/${req.params.id}`);
}

async function editarEndereco(req, res) {
  const endereco = await enderecosService.obterEndereco(req.params.enderecoId);
  res.render('painel/endereco_editar', { endereco, clienteId: req.params.id });
}

async function atualizarEndereco(req, res) {
  await enderecosService.atualizarEndereco(req.params.enderecoId, req.body);
  res.redirect(`/clientes/${req.params.id}`);
}

async function excluirEndereco(req, res) {
  await enderecosService.excluirEndereco(req.params.enderecoId);
  res.redirect(`/clientes/${req.params.id}`);
}

async function principal(req, res) {
  await enderecosService.definirPrincipal(req.params.id, req.params.enderecoId);
  res.redirect(`/clientes/${req.params.id}`);
}


module.exports = {
  clientesController: { index, detalhe, novo, salvar, editar, atualizar, excluir,
    novoEndereco, salvarEndereco, editarEndereco, atualizarEndereco,
    excluirEndereco, principal }
};
