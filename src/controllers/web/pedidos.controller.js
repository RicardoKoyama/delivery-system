// src/controllers/pedidos.controller.js
const pedidosService = require('../../services/pedidos.service');
const { pool } = require('../../config/db');

async function index(req, res) {
  const pedidos = await pedidosService.listarPedidos(req.query);

  const { rows: status } = await pool.query(`
    SELECT id, descricao
    FROM pedido_status
    ORDER BY ordem
  `);

  res.render('painel/pedidos', {
    pedidos,
    status,
    filtros: req.query
  });
}

async function visualizar(req, res) {
  try {
    const pedido = await pedidosService.obterPedido(req.params.id);
    res.render('painel/pedido_detalhe', { pedido });
  } catch (err) {
    res.status(404).send(err.message);
  }
}

async function salvar(req, res) {
  try {
    if (!req.body.itens_json) {
      throw new Error('Nenhum item informado');
    }

    const dados = {
      ...req.body,
      itens: JSON.parse(req.body.itens_json),
      id_usuario: req.session.usuario.id
    };

    const idPedido = await pedidosService.criarPedido(dados);
    res.redirect(`/pedidos/${idPedido}`);

  } catch (err) {
    res.status(400).send(err.message);
  }
}

async function editar(req, res) {
  const { id } = req.params;

  const pedido = await pedidosService.buscarPorId(id);
  const status = await pedidosService.listarStatus();

  if (!pedido) {
    return res.status(404).send('Pedido não encontrado');
  }

  res.render('painel/pedido_editar', {
    pedido,
    status
  });
}

async function atualizarStatus(req, res) {
  try {
    await pedidosService.alterarStatusPedido(
      req.params.id,
      req.body.id_status
    );
    res.redirect(`/pedidos/${req.params.id}`);
  } catch (err) {
    res.status(400).send(err.message);
  }
}

async function novo(req, res) {
  const { rows: clientes } = await pool.query(`
    SELECT id, nome
    FROM clientes
    WHERE ativo = true
    ORDER BY nome
  `);

  const { rows: pagamentos } = await pool.query(`
    SELECT id, descricao
    FROM tipo_pagamento
    ORDER BY descricao
  `);

  const { rows: entregas } = await pool.query(`
    SELECT id, descricao
    FROM tipo_entrega
    ORDER BY descricao
  `);

  const { rows: produtos } = await pool.query(`
    SELECT id, descricao, valor
    FROM produtos
    WHERE ativo = true
    ORDER BY descricao
  `);

    res.render('painel/pedido_novo', {
        clientes,
        pagamentos,
        entregas,
        produtos,
        IDS: {
            RETIRADA: entregas.find(e => e.descricao.toLowerCase().includes('retirada'))?.id,
            DINHEIRO: pagamentos.find(p => p.descricao.toLowerCase().includes('dinheiro'))?.id
        }
    });
    }

async function enderecosCliente(req, res) {
  const { id } = req.params;

  const { rows } = await pool.query(`
    SELECT
      id,
      endereco,
      numero,
      bairro,
      principal
    FROM clientes_endereco
    WHERE id_cliente = $1
      AND ativo = true
    ORDER BY principal DESC, id
  `, [id]);

  res.json(rows);
}

async function atualizar(req, res) {
  const { id } = req.params;
  const { id_status } = req.body;

  await pedidosService.atualizarStatus({
    id_pedido: id,
    id_status,
    id_usuario: req.session.usuario.id
  });

  res.redirect(`/pedidos/${id}`);
}


module.exports = {
  pedidosController: {
    index,
    visualizar,
    novo,
    salvar,
    atualizarStatus,
    enderecosCliente,
    editar,
    atualizar
  }
};
