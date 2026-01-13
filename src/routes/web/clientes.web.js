const express = require('express');
const { requireAuth } = require('../../middlewares/auth');
const { clientesController } = require('../../controllers/web/clientes.controller');

const router = express.Router();

router.get('/clientes', 
    requireAuth, 
    clientesController.index
);

router.get('/clientes/:id', 
    requireAuth, 
    clientesController.detalhe
);

router.get('/clientes/:id/enderecos/novo',
    requireAuth,
    clientesController.novoEndereco
);

router.post('/clientes/:id/enderecos',
    requireAuth,
    clientesController.salvarEndereco
);

router.get('/clientes/novo', 
    requireAuth, 
    clientesController.novo
);

router.post('/clientes', 
    requireAuth, 
    clientesController.salvar
);

router.get('/clientes/:id/editar', 
    requireAuth, 
    clientesController.editar
);

router.post('/clientes/:id/editar', 
    requireAuth, 
    clientesController.atualizar
);

router.post('/clientes/:id/excluir', 
    requireAuth, 
    clientesController.excluir
);

router.get('/clientes/:id/enderecos/novo', 
    requireAuth, 
    clientesController.novoEndereco
);

router.post('/clientes/:id/enderecos', 
    requireAuth, 
    clientesController.salvarEndereco
);

router.get('/clientes/:id/enderecos/:enderecoId/editar', requireAuth, clientesController.editarEndereco);

router.post('/clientes/:id/enderecos/:enderecoId/editar', requireAuth, clientesController.atualizarEndereco);

router.post('/clientes/:id/enderecos/:enderecoId/excluir', requireAuth, clientesController.excluirEndereco);

router.get('/clientes/:id/enderecos/:enderecoId/principal', requireAuth, clientesController.principal);

module.exports = router;
