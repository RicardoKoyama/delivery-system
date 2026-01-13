const { pool } = require('../config/db');

async function listar() {
  const { rows } = await pool.query(`
    SELECT id, descricao
    FROM produto_categoria
    ORDER BY descricao
  `);
  return rows;
}

module.exports = { listar };
