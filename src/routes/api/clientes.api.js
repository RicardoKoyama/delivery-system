const express = require('express');
const { listarClientes, criarCliente } = require('../../services/clientes.service');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const clientes = await listarClientes();
    res.json(clientes);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const cliente = await criarCliente(req.body);
    res.json(cliente);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
