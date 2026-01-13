const express = require('express');
const { requireAuth } = require('../../middlewares/auth');
const { produtosController } = require('../../controllers/web/produtos.controller');

const router = express.Router();

router.get('/produtos', requireAuth, produtosController.index);
router.get('/produtos/novo', requireAuth, produtosController.novo);
router.post('/produtos', requireAuth, produtosController.salvar);

router.get('/produtos/:id/editar', requireAuth, produtosController.editar);
router.post('/produtos/:id/editar', requireAuth, produtosController.atualizar);

router.post('/produtos/:id/excluir', requireAuth, produtosController.excluir);

module.exports = router;
