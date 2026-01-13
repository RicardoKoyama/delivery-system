const produtosRepo = require('../repositories/produtos.repo');
const categoriasRepo = require('../repositories/categorias.repo');

async function listarProdutos() {
  return produtosRepo.listar();
}

async function obterProduto(id) {
  return produtosRepo.buscarPorId(id);
}

async function listarCategorias() {
  return categoriasRepo.listar();
}

async function criarProduto(dados) {
  return produtosRepo.inserir(dados);
}

async function atualizarProduto(id, dados) {
  return produtosRepo.atualizar(id, dados);
}

async function excluirProduto(id) {
  return produtosRepo.desativar(id);
}

module.exports = {
  listarProdutos,
  obterProduto,
  listarCategorias,
  criarProduto,
  atualizarProduto,
  excluirProduto
};
