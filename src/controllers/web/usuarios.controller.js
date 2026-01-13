const usuariosService = require('../../services/usuarios.service');

async function index(req, res) {
  const usuarios = await usuariosService.listarUsuarios();
  res.render('painel/usuarios', { usuarios });
}

async function novo(req, res) {
  const perfis = await usuariosService.listarPerfis();
  res.render('painel/usuario_novo', { perfis });
}

async function salvar(req, res) {
  await usuariosService.criarUsuario(req.body);
  res.redirect('/usuarios');
}

async function editar(req, res) {
  const usuario = await usuariosService.obterUsuario(req.params.id);
  const perfis = await usuariosService.listarPerfis();

  if (!usuario) return res.status(404).send('Usuário não encontrado');

  res.render('painel/usuario_editar', { usuario, perfis });
}

async function atualizar(req, res) {
  await usuariosService.atualizarUsuario(req.params.id, {
    nome: req.body.nome,
    id_perfil: req.body.id_perfil
  });

  if (req.body.senha) {
    await usuariosService.alterarSenha(req.params.id, req.body.senha);
  }

  res.redirect('/usuarios');
}

async function toggle(req, res) {
  const usuario = await usuariosService.obterUsuario(req.params.id);

  if (usuario.ativo) {
    await usuariosService.desativarUsuario(req.params.id);
  } else {
    await usuariosService.ativarUsuario(req.params.id);
  }

  res.redirect('/usuarios');
}

module.exports = {
  usuariosController: {
    index,
    novo,
    salvar,
    editar,
    atualizar,
    toggle
  }
};
