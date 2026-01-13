const express = require('express');
const { requireBotApiKey } = require('../../middlewares/apiKey');
const botPedidosController = require('../../controllers/api/bot.pedidos.controller');

const router = express.Router();

// protege tudo com x-api-key
router.use(requireBotApiKey);

router.post('/pedidos/draft', botPedidosController.criarDraft);
router.post('/pedidos/:id/itens', botPedidosController.adicionarItem);
router.delete('/pedidos/:id/itens/:id_produto', botPedidosController.removerItem);
router.get('/pedidos/:id', botPedidosController.obter);
router.patch('/pedidos/:id/confirmar', botPedidosController.confirmar);

module.exports = router;
