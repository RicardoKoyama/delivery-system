const express = require('express');
const { healthController } = require('../../controllers/api/health.controller');

const router = express.Router();

router.get('/health', healthController);

module.exports = router;
