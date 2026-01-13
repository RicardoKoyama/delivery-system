const express = require('express');
const { authController } = require('../../controllers/web/auth.controller');

const router = express.Router();

router.get('/login', authController.viewLogin);
router.post('/login', authController.doLogin);
router.get('/logout', authController.doLogout);

module.exports = router;
