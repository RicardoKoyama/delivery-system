const bcrypt = require('bcrypt');
const usuariosRepo = require('../repositories/usuarios.repo');
const perfilRepo = require('../repositories/usuarios_perfil.repo');

async function listarUsuarios() {
  return usuariosRepo.listar();
}

async function obterUsuario(id) {
  return usuariosRepo.buscarPorId(id);
}

async function listarPerfis() {
  return perfilRepo.listar();
}

async function criarUsuario({ nome, senha, id_perfil }) {
  const senhaHash = await bcrypt.hash(senha, 10);
  return usuariosRepo.inserir({ nome, senhaHash, id_perfil });
}

async function atualizarUsuario(id, dados) {
  await usuariosRepo.atualizar(id, dados);
}

async function alterarSenha(id, senha) {
  const senhaHash = await bcrypt.hash(senha, 10);
  await usuariosRepo.atualizarSenha(id, senhaHash);
}

async function desativarUsuario(id) {
  await usuariosRepo.desativar(id);
}

async function ativarUsuario(id) {
  await usuariosRepo.ativar(id);
}


async function autenticar(usuario, senha) {
  const user = await usuariosRepo.findByUsuario(usuario);

  if (!user || !user.ativo) {
    return null;
  }

  const senhaOk = await bcrypt.compare(senha, user.senha);

  if (!senhaOk) return null;

  return {
    id: user.id,
    nome: user.usuario,
    perfil: user.perfil
  };
}

module.exports = {
  listarUsuarios,
  obterUsuario,
  listarPerfis,
  criarUsuario,
  atualizarUsuario,
  alterarSenha,
  desativarUsuario,
  ativarUsuario,
  autenticar
};
