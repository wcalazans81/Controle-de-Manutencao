/*const express = require('express');
const router = express.Router();
const conexao = require('../db'); // Banco de dados

// Página inicial (pedidos de serviço)
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM servico';
    conexao.query(sql, (erro, retorno) => {
        if (erro) {
            console.error('Erro ao buscar dados:', erro);
            return res.status(500).send('Erro ao carregar página inicial.');
        }
        res.render('index', { servico: retorno });
    });
});

// Cadastro de pedido
router.post('/cadastrar', (req, res) => {
    const { empresa, nome, setor, descricao } = req.body;
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);
    const data = dataAtual.toISOString().split('T')[0];

    const empresasValidas = ['AFFEMG', 'FUNDAFFEMG', 'FISCO CORRETORA'];
    if (!empresasValidas.includes(empresa.toUpperCase())) {
        return res.render("index", { alerta: "ERRO! A empresa deve ser AFFEMG, FUNDAFFEMG ou FISCO CORRETORA." });
    }

    const sql = `INSERT INTO servico (empresa, nome, setor, data, descricao) VALUES (?, ?, ?, ?, ?)`;
    conexao.query(sql, [empresa, nome, setor, data, descricao], (erro) => {
        if (erro) {
            console.error("Erro ao cadastrar:", erro);
            return res.render("index", { alerta: "Erro ao salvar os dados." });
        }
        res.render("index", { alerta: "Pedido salvo com sucesso!" });
    });
});

// Excluir pedido
router.get('/excluir/:id', (req, res) => {
    const sql = `DELETE FROM servico WHERE id = ?`;
    conexao.query(sql, [req.params.id], (erro) => {
        if (erro) {
            console.error("Erro ao excluir:", erro);
            return res.render("index", { alerta: "Erro ao excluir o pedido." });
        }
        res.redirect('/');
    });
});

// Página de edição de pedido
router.get('/pedidoEditar/:id', (req, res) => {
    const sql = `SELECT * FROM servico WHERE id = ?`;
    conexao.query(sql, [req.params.id], (erro, retorno) => {
        if (erro) {
            console.error("Erro ao buscar pedido para edição:", erro);
            return res.status(500).send('Erro ao buscar pedido.');
        }
        res.render('pedidoEditar', { pedido: retorno[0] });
    });
});

// Editar pedido
router.post('/editar', (req, res) => {
    const { id, empresa, nome, setor, descricao } = req.body;
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);
    const data = dataAtual.toISOString().split('T')[0];

    const empresasValidas = ['AFFEMG', 'FUNDAFFEMG', 'FISCO CORRETORA'];
    if (!empresasValidas.includes(empresa.toUpperCase())) {
        return res.render("index", { alerta: "ERRO! Empresa inválida." });
    }

    const sqlUpdate = `UPDATE servico SET empresa=?, nome=?, setor=?, data=?, descricao=? WHERE id=?`;
    const sqlInsert = `INSERT INTO relat (empres, nom, seto, dat, descric) VALUES (?, ?, ?, ?, ?)`;

    conexao.query(sqlUpdate, [empresa, nome, setor, data, descricao, id], (erroUpdate) => {
        if (erroUpdate) {
            console.error("Erro UPDATE:", erroUpdate);
            return res.status(500).send("Erro ao atualizar pedido.");
        }

        conexao.query(sqlInsert, [empresa, nome, setor, data, descricao], (erroInsert) => {
            if (erroInsert) {
                console.error("Erro ao salvar no histórico:", erroInsert);
                return res.status(500).send("Erro ao salvar histórico.");
            }
            res.redirect('/');
        });
    });
});

module.exports = router;*/
