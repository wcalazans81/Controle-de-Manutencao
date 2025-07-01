const express = require('express');
const router = express.Router();
const conexao = require('../db');

router.post('/cadastrar', (req, res) => {
    const {
        eletrica, hidraulica, esgoto, pintura, eletrodomestico,
        eletroeletronico, moveis, porta, janela, arcondicionado, outros
    } = req.body;

    let dataAtual = new Date(); 
    dataAtual.setHours(0, 0, 0, 0); 
    let data = dataAtual.toISOString().split('T')[0];


    const sql = `
        INSERT INTO chec (data, eletrica, hidraulica, esgoto, pintura, eletrodomestico, 
        eletroeletronico, moveis, porta, janela, arcondicionado, outros) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        data, eletrica, hidraulica, esgoto, pintura, eletrodomestico,
        eletroeletronico, moveis, porta, janela, arcondicionado, outros
    ];

    conexao.query(sql, valores, (erro, resultado) => {
        if (erro) {
            console.error("Erro ao salvar checklist:", erro);
            return res.status(500).json({ sucesso: false });
        }

        console.log("Checklist salvo com sucesso:", resultado);
        res.json({ sucesso: true });
    });
});

exports.paginaRelatChecklist = (req, res) => {
    res.render('relatChecklist', {
        mostrarMenu: true // ativa o botão menu nessa página
    });
};


module.exports = router;
