const { Pool } = require('pg');
const { env } = require('./env');

const pool = new Pool({
  connectionString: env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('[DB] Erro inesperado no pool', err);
});

async function healthCheck() {
  const r = await pool.query('SELECT 1 AS ok');
  return r.rows?.[0]?.ok === 1;
}

module.exports = { pool, healthCheck };
