// src/routes/web/pedidos.web.js
const express = require('express');
const { requireAuth } = require('../../middlewares/auth');
const { pedidosController } = require('../../controllers/web/pedidos.controller');

const router = express.Router();

// listagem
router.get('/pedidos', requireAuth, pedidosController.index);

// novo pedido (form) — ⚠️ ANTES do :id
router.get('/pedidos/novo', requireAuth, pedidosController.novo);

// salvar pedido
router.post('/pedidos', requireAuth, pedidosController.salvar);

// ajax: endereços do cliente
router.get(
  '/pedidos/cliente/:id/enderecos',
  requireAuth,
  pedidosController.enderecosCliente
);

// visualizar pedido
router.get('/pedidos/:id', requireAuth, pedidosController.visualizar);

// atualizar status
router.post(
  '/pedidos/:id/status',
  requireAuth,
  pedidosController.atualizarStatus
);

// tela de edição
router.get(
  '/pedidos/:id/editar',
  requireAuth,
  pedidosController.editar
);

// salvar edição (status)
router.post(
  '/pedidos/:id/editar',
  requireAuth,
  pedidosController.atualizar
);


module.exports = router;
