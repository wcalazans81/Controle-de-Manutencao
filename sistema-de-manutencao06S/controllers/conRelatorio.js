const express = require('express');
const router = express.Router();
const db = require('../db');

exports.getRelatorio = (req, res) => {
    const { empresa, dataInicio, dataFim } = req.query;

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
            console.error(erro);
            return res.render('relatorio', { erro: 'Erro ao buscar os dados.' });
        }

        res.render('relatorio', { dados: resultados });
    });
};

exports.paginaRelatChecklist = (req, res) => {
    res.render('relatChecklist', {
        mostrarMenu: true // ativa o botão menu nessa página
    });
};


module.exports = router;
