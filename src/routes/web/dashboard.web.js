const express = require('express');
const { requireAuth } = require('../../middlewares/auth');
const { dashboardController } = require('../../controllers/web/dashboard.controller');

const router = express.Router();

router.get('/', (req, res) => res.redirect('/dashboard'));
router.get('/dashboard', requireAuth, dashboardController.index);

module.exports = router;
