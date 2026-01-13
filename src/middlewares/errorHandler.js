function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);

  // Se for API
  if (req.path.startsWith('/api')) {
    return res.status(500).json({ ok: false, error: 'Erro interno' });
  }

  // Se for web
  return res.status(500).send('Erro interno');
}

module.exports = { errorHandler };
