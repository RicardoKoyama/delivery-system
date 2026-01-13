const { pool } = require('../config/db');

async function listar() {
  const { rows } = await pool.query(`
    SELECT
      u.id,
      u.nome,
      u.ativo,
      p.descricao AS perfil
    FROM usuarios u
    JOIN usuarios_perfil p ON p.id = u.id_perfil
    ORDER BY u.nome
  `);
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`
    SELECT
      u.id,
      u.nome,
      u.id_perfil,
      u.ativo
    FROM usuarios u
    WHERE u.id = $1
  `, [id]);
  return rows[0];
}

async function inserir({ nome, senhaHash, id_perfil }) {
  const { rows } = await pool.query(`
    INSERT INTO usuarios (nome, senha, id_perfil, ativo)
    VALUES ($1, $2, $3, true)
    RETURNING id
  `, [nome, senhaHash, id_perfil]);
  return rows[0];
}

async function atualizar(id, { nome, id_perfil }) {
  await pool.query(`
    UPDATE usuarios
    SET nome = $1,
        id_perfil = $2,
        data_alteracao = CURRENT_TIMESTAMP
    WHERE id = $3
  `, [nome, id_perfil, id]);
}

async function atualizarSenha(id, senhaHash) {
  await pool.query(`
    UPDATE usuarios
    SET senha = $1,
        data_alteracao = CURRENT_TIMESTAMP
    WHERE id = $2
  `, [senhaHash, id]);
}

async function desativar(id) {
  await pool.query(`
    UPDATE usuarios
    SET ativo = false,
        data_exclusao = CURRENT_TIMESTAMP
    WHERE id = $1
  `, [id]);
}

async function ativar(id) {
  await pool.query(`
    UPDATE usuarios
    SET ativo = true,
        data_exclusao = NULL
    WHERE id = $1
  `, [id]);
}


async function findByUsuario(usuario) {
  const { rows } = await pool.query(`
    select u.id, u.nome as usuario, u.senha, up.descricao as perfil, u.ativo 
      from usuarios u
      left join usuarios_perfil up on up.id = u.id_perfil  
    WHERE upper(u.nome) = upper($1)
    LIMIT 1
  `, [usuario]);

  return rows[0];
}


module.exports = {
  listar,
  buscarPorId,
  inserir,
  atualizar,
  atualizarSenha,
  desativar,
  ativar,
  findByUsuario
};
