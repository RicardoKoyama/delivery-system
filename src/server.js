const http = require('http');
const app = require('./app');
const { env } = require('./config/env');

const server = http.createServer(app);

server.listen(env.PORT, () => {
  console.log(`[START] Delivery BOT online - Porta ${env.PORT} (env=${env.NODE_ENV})`);
});
