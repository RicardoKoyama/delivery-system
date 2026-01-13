const produtosService = require('../../services/produtos.service');

async function index(req, res) {
  const produtos = await produtosService.listarProdutos();
  res.render('painel/produtos', { produtos });
}

async function novo(req, res) {
  const categorias = await produtosService.listarCategorias();
  res.render('painel/produto_novo', { categorias });
}

async function salvar(req, res) {
  await produtosService.criarProduto(req.body);
  res.redirect('/produtos');
}

async function editar(req, res) {
  const produto = await produtosService.obterProduto(req.params.id);
  const categorias = await produtosService.listarCategorias();

  if (!produto) return res.status(404).send('Produto não encontrado');

  res.render('painel/produto_editar', { produto, categorias });
}

async function atualizar(req, res) {
  await produtosService.atualizarProduto(req.params.id, req.body);
  res.redirect('/produtos');
}

async function excluir(req, res) {
  await produtosService.excluirProduto(req.params.id);
  res.redirect('/produtos');
}

module.exports = {
  produtosController: {
    index,
    novo,
    salvar,
    editar,
    atualizar,
    excluir
  }
};
