function requireBotApiKey(req, res, next) {
  const expected = process.env.BOT_API_KEY;
  if (!expected) {
    return res.status(500).json({ error: 'BOT_API_KEY não configurado no servidor' });
  }

  const provided = req.headers['x-api-key'];
  if (!provided || provided !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

module.exports = { requireBotApiKey };
