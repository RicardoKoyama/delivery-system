const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { env } = require('./env');
const { pool } = require('./db');

function sessionMiddleware() {
  return session({
    name: env.SESSION_NAME,
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 12 // 12h
    },
    store: new pgSession({
      pool,
      tableName: 'web_sessions'
    })
  });
}

module.exports = { sessionMiddleware };
