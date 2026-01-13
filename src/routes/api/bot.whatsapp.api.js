const express = require('express');
const { requireBotApiKey } = require('../../middlewares/apiKey');
const controller = require('../../controllers/api/bot.whatsapp.controller');

const router = express.Router();

router.use(requireBotApiKey);
router.post('/whatsapp/status', controller.atualizarStatus);

module.exports = router;
