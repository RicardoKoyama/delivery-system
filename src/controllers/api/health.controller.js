const { healthCheck } = require('../../config/db');

async function healthController(req, res, next) {
  try {
    const ok = await healthCheck();
    res.json({ ok, timestamp: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
}

module.exports = { healthController };
