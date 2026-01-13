const express = require('express');
const { requireAuth } = require('../../middlewares/auth');
const { usuariosController } = require('../../controllers/web/usuarios.controller');

const router = express.Router();

router.get('/usuarios', requireAuth, usuariosController.index);


router.get('/usuarios/novo', requireAuth, usuariosController.novo);
router.post('/usuarios', requireAuth, usuariosController.salvar);

router.get('/usuarios/:id/editar', requireAuth, usuariosController.editar);
router.post('/usuarios/:id/editar', requireAuth, usuariosController.atualizar);

router.post('/usuarios/:id/toggle', requireAuth, usuariosController.toggle);

module.exports = router;
