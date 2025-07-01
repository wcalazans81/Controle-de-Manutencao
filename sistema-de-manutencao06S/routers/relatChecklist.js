const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa a conexão com MySQL

// Rota para exibir a página relatChecklist
router.get('/', (req, res) => {
    res.render('relatChecklist', {
        mostrarMenu: true
    });
});


// Rota GET para buscar os dados com filtros
router.get('/dados', (req, res) => {
    const { mes, ano } = req.query;

    // Construa a query com base nos filtros de mês e ano
    let query = 'SELECT * FROM chec WHERE 1 = 1';
    const params = [];

    if (mes) {
        query += ' AND MONTH(data) = ?';
        params.push(mes);
    }

    if (ano) {
        query += ' AND YEAR(data) = ?';
        params.push(ano);
    }

    // Realize a consulta utilizando o método com callback
    db.query(query, params, (erro, results) => {
        if (erro) {
            console.error('Erro ao buscar dados do checklist:', erro);
            return res.status(500).json({ error: 'Erro no servidor' });
        }
        // Retorne os resultados como resposta JSON
        res.json(results);
    });
});

module.exports = router;