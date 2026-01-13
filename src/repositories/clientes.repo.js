const { pool } = require('../config/db');

async function listar() {
  const { rows } = await pool.query(`
    SELECT id, nome, telefone, ativo
    FROM clientes
    WHERE ativo = true
    ORDER BY nome
  `);
  return rows;
}

async function inserir({ nome, telefone }) {
  const { rows } = await pool.query(`
    INSERT INTO clientes (nome, telefone, ativo)
    VALUES ($1, $2, true)
    RETURNING *
  `, [nome, telefone]);
  return rows[0];
}

async function atualizar(id, { nome, telefone }) {
  await pool.query(`
    UPDATE clientes
    SET nome = $1, telefone = $2, data_alteracao = NOW()
    WHERE id = $3
  `, [nome, telefone, id]);
}

async function desativar(id) {
  await pool.query(`
    UPDATE clientes
    SET ativo = false and data_exclusao = NOW()
    WHERE id = $1
  `, [id]);
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`
    SELECT *
    FROM clientes
    WHERE id = $1
  `, [id]);

  return rows[0];
}

module.exports = { listar, inserir, buscarPorId, atualizar, desativar };
