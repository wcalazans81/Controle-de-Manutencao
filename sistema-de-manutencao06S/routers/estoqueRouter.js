const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');

router.get('/', estoqueController.listarItens);
router.post('/adicionar', estoqueController.adicionarItem);
router.post('/atualizar', estoqueController.atualizarQuantidade);
router.post('/excluir', estoqueController.excluirItem);

module.exports = router;
