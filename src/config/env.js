require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT),

  DATABASE_URL: process.env.DATABASE_URL,

  SESSION_SECRET: process.env.SESSION_SECRET || 'dev-secret',
  SESSION_NAME: process.env.SESSION_NAME || 'delivery.sid'
};

if (!env.DATABASE_URL) {
  console.warn('[WARN] DATABASE_URL não definido no .env');
}

module.exports = { env };
