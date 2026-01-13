const { pool } = require('../config/db');

async function listar() {
  const { rows } = await pool.query(`
    SELECT
      p.id,
      p.descricao,
      p.valor,
      p.ativo,
      c.descricao AS categoria
    FROM produtos p
    LEFT JOIN produto_categoria c ON c.id = p.id_categoria
    ORDER BY p.descricao
  `);
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`
    SELECT *
    FROM produtos
    WHERE id = $1
  `, [id]);
  return rows[0];
}

async function inserir(d) {
  const { rows } = await pool.query(`
    INSERT INTO produtos
      (descricao, valor, composicao, foto, id_categoria, ativo)
    VALUES
      ($1,$2,$3,$4,$5,true)
    RETURNING id
  `, [
    d.descricao,
    d.valor,
    d.composicao || null,
    d.foto || null,
    d.id_categoria || null
  ]);

  return rows[0];
}

async function atualizar(id, d) {
  await pool.query(`
    UPDATE produtos
    SET descricao = $1,
        valor = $2,
        composicao = $3,
        foto = $4,
        id_categoria = $5,
        data_alteracao = CURRENT_TIMESTAMP
    WHERE id = $6
  `, [
    d.descricao,
    d.valor,
    d.composicao || null,
    d.foto || null,
    d.id_categoria || null,
    id
  ]);
}

async function desativar(id) {
  await pool.query(`
    UPDATE produtos
    SET ativo = false,
        data_exclusao = CURRENT_TIMESTAMP
    WHERE id = $1
  `, [id]);
}

module.exports = { listar, buscarPorId, inserir, atualizar, desativar };
