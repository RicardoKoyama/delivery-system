const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const { sessionMiddleware } = require('./config/session');
const { errorHandler } = require('./middlewares/errorHandler');

const routes = require('./routes');

const app = express();

// Segurança
app.use(helmet());
app.use(compression());

// Logs
app.use(morgan('dev'));

// Body parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ SESSÃO — TEM QUE VIR ANTES
app.use(sessionMiddleware());

// ✅ Agora sim a session existe
app.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
});

// Static
app.use('/public', express.static(path.join(__dirname, 'public')));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Rotas
app.use('/', routes);

// Error handler
app.use(errorHandler);

module.exports = app;
