const { pool } = require('../../config/db');

async function index(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM public.whatsapp_instance
      ORDER BY atualizado_em DESC
    `);

    return res.render('painel/whatsapp', {
      instancias: rows
    });

  } catch (err) {
    console.error('❌ Erro ao carregar console WhatsApp:', err);

    return res.status(500).render('painel/whatsapp', {
      instancias: [],
      erro: 'Erro ao carregar dados do WhatsApp'
    });
  }
}

async function statusJson(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT *
      FROM public.whatsapp_instance
      ORDER BY atualizado_em DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
}

async function reset(req, res) {
  const { instance_name } = req.body;

  await pool.query(
    `
    UPDATE public.whatsapp_instance
    SET reset_solicitado = true
    WHERE instance_name = $1
    `,
    [instance_name]
  );

  res.json({ ok: true });
}



module.exports = { index, statusJson, reset };
