const express = require('express');
const { requireAuth } = require('../../middlewares/auth');
const controller = require('../../controllers/web/whatsapp.controller');

const router = express.Router();

router.get('/whatsapp', requireAuth, controller.index);
router.get('/whatsapp/status/json', requireAuth, controller.statusJson);
router.post('/whatsapp/reset', requireAuth, controller.reset);


module.exports = router;
