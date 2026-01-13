// src/services/pedidos.service.js
const pedidosRepo = require('../repositories/pedidos.repo');
const produtosRepo = require('../repositories/produtos.repo');

async function listarPedidos(filtros) {
  return pedidosRepo.listar(filtros);
}

async function obterPedido(id) {
  const pedido = await pedidosRepo.buscarPorId(id);
  if (!pedido) throw new Error('Pedido não encontrado');

  const itens = await pedidosRepo.listarItens(id);
  pedido.itens = itens;

  return pedido;
}

async function criarPedido(dados) {
  if (!dados.itens || dados.itens.length === 0) {
    throw new Error('Pedido deve conter ao menos um item');
  }

  // Exemplo: pagamento em dinheiro = id 1
  if (dados.id_tipo_pagamento == 1 && !dados.troco_para) {
    throw new Error('Informe o valor para troco');
  }

  const pedido = await pedidosRepo.inserir(dados);

  let total = 0;

  for (const item of dados.itens) {
    const produto = await produtosRepo.buscarPorId(item.id_produto);
    if (!produto) throw new Error('Produto inválido');

    const subtotal = produto.valor * item.quantidade;
    total += subtotal;

    await pedidosRepo.inserirItem({
      id_pedido: pedido.id,
      id_produto: produto.id,
      quantidade: item.quantidade,
      valor: produto.valor
    });
  }

  await pedidosRepo.atualizarValorTotal(pedido.id, total);

  return pedido.id;
}

async function alterarStatusPedido(idPedido, idStatus) {
  const pedido = await pedidosRepo.buscarPorId(idPedido);
  if (!pedido) throw new Error('Pedido não encontrado');

  // regra simples inicial (pode evoluir depois)
  if (pedido.id_status && idStatus < pedido.id_status) {
    throw new Error('Não é permitido voltar status');
  }

  await pedidosRepo.atualizarStatus(idPedido, idStatus);
}

async function atualizarStatus({ id_pedido, id_status, id_usuario }) {
  const pedido = await pedidosRepo.buscarPorId(id_pedido);
  if (!pedido) throw new Error('Pedido não encontrado');

  // regra simples inicial
  if (pedido.id_status && id_status < pedido.id_status) {
    throw new Error('Não é permitido voltar status');
  }

  await pedidosRepo.atualizarStatus({
    id_pedido,
    id_status,
    id_usuario
  });
}



module.exports = {
  listarPedidos,
  obterPedido,
  criarPedido,
  alterarStatusPedido,
  atualizarStatus 
};
