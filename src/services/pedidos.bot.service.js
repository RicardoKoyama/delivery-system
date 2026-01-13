const { pool } = require('../config/db');

async function criarDraft({ id_cliente, id_cliente_endereco = null }) {
  const botUserId = Number(process.env.BOT_USER_ID || 0);
  if (!botUserId) throw new Error('BOT_USER_ID não configurado');

  const { rows } = await pool.query(
    `
    INSERT INTO public.pedidos (
      id_cliente,
      id_cliente_endereco,
      id_usuario,
      observacao,
      id_status,
      valor_total,
      confirmado,
      valor_pago,
      troco_para,
      id_tipo_pagamento,
      id_tipo_entrega
    ) VALUES ($1,$2,$3,NULL,NULL,0,false,NULL,NULL,NULL,NULL)
    RETURNING id
    `,
    [id_cliente, id_cliente_endereco, botUserId]
  );

  return { id: rows[0].id };
}

async function obterPedidoComItens(id_pedido) {
  const { rows: pedidoRows } = await pool.query(
    `
    SELECT p.*
    FROM public.pedidos p
    WHERE p.id = $1
    LIMIT 1
    `,
    [id_pedido]
  );
  const pedido = pedidoRows[0];
  if (!pedido) throw new Error('Pedido não encontrado');

  const { rows: itens } = await pool.query(
    `
    SELECT
      pp.id_produto,
      pr.descricao,
      pp.quantidade,
      pp.valor,
      (pp.quantidade * pp.valor) AS total
    FROM public.pedidos_produtos pp
    JOIN public.produtos pr ON pr.id = pp.id_produto
    WHERE pp.id_pedido = $1
    ORDER BY pr.descricao
    `,
    [id_pedido]
  );

  return { ...pedido, itens };
}

async function adicionarOuSomarItem({ id_pedido, id_produto, quantidade }) {
  if (!quantidade || quantidade <= 0) throw new Error('Quantidade inválida');

  // Busca valor do produto
  const { rows: prodRows } = await pool.query(
    `SELECT id, valor FROM public.produtos WHERE id = $1 AND ativo = true LIMIT 1`,
    [id_produto]
  );
  const produto = prodRows[0];
  if (!produto) throw new Error('Produto inválido');

  await pool.query('BEGIN');

  try {
    // Verifica se já existe item
    const { rows: itemRows } = await pool.query(
      `
      SELECT id_produto, quantidade
      FROM public.pedidos_produtos
      WHERE id_pedido = $1 AND id_produto = $2
      LIMIT 1
      `,
      [id_pedido, id_produto]
    );

    if (itemRows[0]) {
      await pool.query(
        `
        UPDATE public.pedidos_produtos
        SET quantidade = quantidade + $3
        WHERE id_pedido = $1 AND id_produto = $2
        `,
        [id_pedido, id_produto, quantidade]
      );
    } else {
      await pool.query(
        `
        INSERT INTO public.pedidos_produtos (id_pedido, id_produto, quantidade, valor)
        VALUES ($1,$2,$3,$4)
        `,
        [id_pedido, id_produto, quantidade, produto.valor]
      );
    }

    await recalcularTotal(id_pedido);

    await pool.query('COMMIT');
  } catch (e) {
    await pool.query('ROLLBACK');
    throw e;
  }

  return obterPedidoComItens(id_pedido);
}

async function removerItem({ id_pedido, id_produto }) {
  await pool.query('BEGIN');
  try {
    await pool.query(
      `
      DELETE FROM public.pedidos_produtos
      WHERE id_pedido = $1 AND id_produto = $2
      `,
      [id_pedido, id_produto]
    );

    await recalcularTotal(id_pedido);

    await pool.query('COMMIT');
  } catch (e) {
    await pool.query('ROLLBACK');
    throw e;
  }

  return obterPedidoComItens(id_pedido);
}

async function recalcularTotal(id_pedido) {
  const { rows } = await pool.query(
    `
    SELECT COALESCE(SUM(quantidade * valor), 0) AS total
    FROM public.pedidos_produtos
    WHERE id_pedido = $1
    `,
    [id_pedido]
  );

  const total = Number(rows[0].total || 0);

  await pool.query(
    `
    UPDATE public.pedidos
    SET valor_total = $1
    WHERE id = $2
    `,
    [total, id_pedido]
  );

  return total;
}

async function confirmarPedido({
  id_pedido,
  id_tipo_pagamento,
  id_tipo_entrega,
  id_cliente_endereco = null,
  observacao = null,
  troco_para = null,
  valor_pago = null,
  id_status = null
}) {
  // Valida itens
  const { rows: itemCountRows } = await pool.query(
    `SELECT COUNT(*)::int AS n FROM public.pedidos_produtos WHERE id_pedido = $1`,
    [id_pedido]
  );
  if (itemCountRows[0].n <= 0) throw new Error('Pedido deve conter ao menos um item');

  // Recalcula total antes de confirmar
  const total = await recalcularTotal(id_pedido);

  // Regra troco (aproveite sua regra: dinheiro == 1, mas aqui tornamos configurável)
  const dinheiroId = Number(process.env.DINHEIRO_ID || 1);
  if (Number(id_tipo_pagamento) === dinheiroId && !troco_para) {
    throw new Error('Informe o valor para troco');
  }

  await pool.query(
    `
    UPDATE public.pedidos
    SET
      id_tipo_pagamento = $1,
      id_tipo_entrega   = $2,
      id_cliente_endereco = COALESCE($3, id_cliente_endereco),
      observacao        = $4,
      troco_para        = $5,
      valor_pago        = $6,
      confirmado        = true,
      id_status         = $7,
      valor_total       = $8
    WHERE id = $9
    `,
    [
      id_tipo_pagamento,
      id_tipo_entrega,
      id_cliente_endereco,
      observacao,
      troco_para,
      valor_pago,
      id_status,
      total,
      id_pedido
    ]
  );

  return obterPedidoComItens(id_pedido);
}

module.exports = {
  criarDraft,
  obterPedidoComItens,
  adicionarOuSomarItem,
  removerItem,
  confirmarPedido
};
