const { pool } = require('../config/db');

async function listarPorCliente(clienteId) {
  const { rows } = await pool.query(`
    SELECT *
    FROM clientes_endereco
    WHERE id_cliente = $1
      AND ativo = true
    ORDER BY principal DESC, id 
  `, [clienteId]);

  return rows;
}

async function inserir(clienteId, dados) {
  const {
    descricao,
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
    cep
  } = dados;

  const { rows } = await pool.query(`
    INSERT INTO clientes_endereco
      (id_cliente, descricao, endereco, numero, complemento, bairro, cidade, cep, ativo)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,true)
    RETURNING *
  `, [
    clienteId,
    descricao,
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
    cep
  ]);

  return rows[0];
}

async function definirPrincipal(clienteId, enderecoId) {
  await pool.query(`
    UPDATE clientes_endereco
    SET principal = false
    WHERE id_cliente = $1
  `, [clienteId]);

  await pool.query(`
    UPDATE clientes_endereco
    SET principal = true
    WHERE id = $1
  `, [enderecoId]);
}

async function desativar(enderecoId) {
  await pool.query(`
    UPDATE clientes_endereco
    SET ativo = false, data_exclusao = NOW()
    WHERE id = $1
  `, [enderecoId]);
}

async function atualizar(id, d) {
  await pool.query(`
    UPDATE clientes_endereco
    SET descricao=$1, endereco=$2, numero=$3, complemento=$4,
        bairro=$5, cidade=$6, cep=$7, data_alteracao=NOW()
    WHERE id=$8
  `, [d.descricao, d.logradouro, d.numero, d.complemento, d.bairro, d.cidade, d.cep, id]);
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`SELECT * FROM clientes_endereco WHERE id=$1`, [id]);
  return rows[0];
}

module.exports = { listarPorCliente, inserir, atualizar, desativar, definirPrincipal, buscarPorId };