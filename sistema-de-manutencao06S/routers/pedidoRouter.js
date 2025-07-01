const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Cadastro de pedido
router.post('/cadastrar', pedidoController.cadastrarPedido);

// Editar pedido (GET)
router.get('/pedidoEditar/:id', pedidoController.editarPedidoGet);

// Editar pedido (POST)
router.post('/editar', pedidoController.editarPedidoPost);

// Excluir pedido com histórico
router.get('/excluir/:id', pedidoController.excluirPedido);

module.exports = router;
