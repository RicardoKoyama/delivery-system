const pedidosBotService = require('../../services/pedidos.bot.service');

async function criarDraft(req, res, next) {
  try {
    const { id_cliente, id_cliente_endereco } = req.body;
    if (!id_cliente) return res.status(400).json({ error: 'id_cliente é obrigatório' });

    const r = await pedidosBotService.criarDraft({ id_cliente, id_cliente_endereco });
    res.json(r);
  } catch (e) {
    next(e);
  }
}

async function adicionarItem(req, res, next) {
  try {
    const id_pedido = Number(req.params.id);
    const { id_produto, quantidade } = req.body;

    if (!id_pedido) return res.status(400).json({ error: 'id_pedido inválido' });
    if (!id_produto) return res.status(400).json({ error: 'id_produto é obrigatório' });

    const r = await pedidosBotService.adicionarOuSomarItem({
      id_pedido,
      id_produto: Number(id_produto),
      quantidade: Number(quantidade || 1)
    });

    res.json(r);
  } catch (e) {
    next(e);
  }
}

async function removerItem(req, res, next) {
  try {
    const id_pedido = Number(req.params.id);
    const id_produto = Number(req.params.id_produto);

    const r = await pedidosBotService.removerItem({ id_pedido, id_produto });
    res.json(r);
  } catch (e) {
    next(e);
  }
}

async function obter(req, res, next) {
  try {
    const id_pedido = Number(req.params.id);
    const r = await pedidosBotService.obterPedidoComItens(id_pedido);
    res.json(r);
  } catch (e) {
    next(e);
  }
}

async function confirmar(req, res, next) {
  try {
    const id_pedido = Number(req.params.id);

    const {
      id_tipo_pagamento,
      id_tipo_entrega,
      id_cliente_endereco,
      observacao,
      troco_para,
      valor_pago,
      id_status
    } = req.body;

    if (!id_tipo_pagamento) return res.status(400).json({ error: 'id_tipo_pagamento é obrigatório' });
    if (!id_tipo_entrega) return res.status(400).json({ error: 'id_tipo_entrega é obrigatório' });

    const r = await pedidosBotService.confirmarPedido({
      id_pedido,
      id_tipo_pagamento: Number(id_tipo_pagamento),
      id_tipo_entrega: Number(id_tipo_entrega),
      id_cliente_endereco: id_cliente_endereco ? Number(id_cliente_endereco) : null,
      observacao: observacao || null,
      troco_para: troco_para ? Number(troco_para) : null,
      valor_pago: valor_pago ? Number(valor_pago) : null,
      id_status: id_status ? Number(id_status) : null
    });

    res.json(r);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  criarDraft,
  adicionarItem,
  removerItem,
  obter,
  confirmar
};
