const { pool } = require('../../config/db');

async function atualizarStatus(req, res) {
  const { instance_name, status, qr_raw } = req.body;

  if (!instance_name || !status) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  await pool.query(
    `
    INSERT INTO public.whatsapp_instance
      (instance_name, status, qr_raw, last_seen, atualizado_em)
    VALUES ($1, $2, $3, now(), now())
    ON CONFLICT (instance_name)
    DO UPDATE SET
      status = EXCLUDED.status,
      qr_raw = CASE
                WHEN EXCLUDED.status = 'ready' THEN NULL
                ELSE EXCLUDED.qr_raw
              END,
      last_seen = now(),
      atualizado_em = now()
    `,
    [instance_name, status, qr_raw || null]
  );


  res.json({ ok: true });
}

module.exports = { atualizarStatus };
