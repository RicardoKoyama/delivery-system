// src/repositories/pedidos.repo.js
const { pool } = require('../config/db');

/**
 * Lista pedidos com filtros opcionais
 */
async function listar(filtros = {}) {
  const params = [];
  let where = '1=1';

  if (filtros.id_status) {
    params.push(filtros.id_status);
    where += ` AND p.id_status = $${params.length}`;
  }

  if (filtros.id_cliente) {
    params.push(filtros.id_cliente);
    where += ` AND p.id_cliente = $${params.length}`;
  }

  const { rows } = await pool.query(`
    SELECT
      p.id,
      p.data_hora,
      c.nome AS cliente,
      ps.descricao AS status,
      p.valor_total,
      p.confirmado
    FROM pedidos p
    JOIN clientes c ON c.id = p.id_cliente
    LEFT JOIN pedido_status ps ON ps.id = p.id_status
    WHERE ${where}
    ORDER BY p.data_hora DESC
  `, params);

  return rows;
}

/**
 * Busca pedido por ID
 */
async function buscarPorId(id) {
  const { rows } = await pool.query(`
    SELECT
      p.*,
      c.nome AS cliente,
      ce.endereco,
      ce.numero,
      ce.bairro,
      tp.descricao AS tipo_pagamento,
      te.descricao AS tipo_entrega,
      ps.descricao AS status
    FROM pedidos p
    JOIN clientes c ON c.id = p.id_cliente
    JOIN clientes_endereco ce ON ce.id = p.id_cliente_endereco
    JOIN tipo_pagamento tp ON tp.id = p.id_tipo_pagamento
    JOIN tipo_entrega te ON te.id = p.id_tipo_entrega
    LEFT JOIN pedido_status ps ON ps.id = p.id_status
    WHERE p.id = $1
  `, [id]);

  return rows[0];
}

/**
 * Lista itens do pedido
 */
async function listarItens(idPedido) {
  const { rows } = await pool.query(`
    SELECT
      pp.id,
      pr.descricao,
      pp.quantidade,
      pp.valor,
      (pp.quantidade * pp.valor) AS total
    FROM pedidos_produtos pp
    JOIN produtos pr ON pr.id = pp.id_produto
    WHERE pp.id_pedido = $1
    ORDER BY pr.descricao
  `, [idPedido]);

  return rows;
}

/**
 * Insere pedido
 */
async function inserir(d) {
  const { rows } = await pool.query(`
    INSERT INTO pedidos (
      id_cliente,
      id_cliente_endereco,
      id_tipo_pagamento,
      id_tipo_entrega,
      id_usuario,
      observacao,
      id_status,
      valor_total,
      confirmado,
      valor_pago,
      troco_para
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,0,false,$8,$9)
    RETURNING id
  `, [
    d.id_cliente,
    d.id_cliente_endereco,
    d.id_tipo_pagamento,
    d.id_tipo_entrega,
    d.id_usuario,
    d.observacao || null,
    d.id_status,
    d.valor_pago || null,
    d.troco_para || null
  ]);

  return rows[0];
}

/**
 * Insere item do pedido
 */
async function inserirItem(d) {
  await pool.query(`
    INSERT INTO pedidos_produtos
      (id_pedido, id_produto, quantidade, valor)
    VALUES ($1,$2,$3,$4)
  `, [
    d.id_pedido,
    d.id_produto,
    d.quantidade,
    d.valor
  ]);
}

/**
 * Atualiza valor total do pedido
 */
async function atualizarValorTotal(idPedido, valorTotal) {
  await pool.query(`
    UPDATE pedidos
    SET valor_total = $1
    WHERE id = $2
  `, [valorTotal, idPedido]);
}

/**
 * Atualiza status do pedido
 */
async function atualizarStatus(idPedido, idStatus) {
  await pool.query(`
    UPDATE pedidos
    SET id_status = $1
    WHERE id = $2
  `, [idStatus, idPedido]);
}

async function listarStatus() {
  const { rows } = await pool.query(`
    SELECT id, descricao
    FROM pedidos_status
    ORDER BY ordem
  `);
  return rows;
}


module.exports = {
  listar,
  buscarPorId,
  listarItens,
  inserir,
  inserirItem,
  atualizarValorTotal,
  atualizarStatus,
  listarStatus
};
