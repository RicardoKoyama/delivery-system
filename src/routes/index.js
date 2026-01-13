const express = require('express');

const apiHealth = require('./api/health.api');
const clientesApi = require('./api/clientes.api');
const botPedidosApi = require('./api/bot.pedidos.api');
const botWhatsappApi = require('./api/bot.whatsapp.api');

const webAuth = require('./web/auth.web');
const webDashboard = require('./web/dashboard.web');
const webClientes = require('./web/clientes.web');
const webProdutos = require('./web/produtos.web');
const webUsuarios = require('./web/usuarios.web');
const webPedidos = require('./web/pedidos.web');
const webWhatsapp = require('./web/whatsapp.web');


const router = express.Router();

router.use('/api', apiHealth);
router.use('/api/clientes', clientesApi);

router.use('/api/bot', botPedidosApi);
router.use('/api/bot', botWhatsappApi);

router.use('/', webAuth);
router.use('/', webDashboard);
router.use('/', webClientes);
router.use('/', webProdutos);
router.use('/', webUsuarios);
router.use('/', webPedidos);
router.use('/', webWhatsapp);

module.exports = router;
