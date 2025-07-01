const express = require('express');
const router = express.Router();
const db = require('../db'); // Caminho correto para o db.js

router.get('/', (req, res) => {
    const { empresa, dataInicio, dataFim } = req.query;

    // Verifica se não há filtros: retorna a tela com dados vazios
    if (!empresa && !dataInicio && !dataFim) {
    return res.render('relatorio', { dados: [] });
    }

    let sql = 'SELECT empres, nom, seto, dat, descric FROM relat WHERE 1=1';
    const params = [];

    if (empresa && empresa !== 'Geral') {
        sql += ' AND empres = ?';
        params.push(empresa);
    }

    if (dataInicio) {
        sql += ' AND dat >= ?';
        params.push(dataInicio);
    }

    if (dataFim) {
        sql += ' AND dat <= ?';
        params.push(dataFim);
    }

    db.query(sql, params, (erro, resultados) => {
        if (erro) {
            console.error('Erro na consulta:', erro);
            return res.render('relatorio', { erro: 'Erro ao buscar os dados.' });
        }

        res.render('relatorio', { dados: resultados });
    });
});

module.exports = router;
