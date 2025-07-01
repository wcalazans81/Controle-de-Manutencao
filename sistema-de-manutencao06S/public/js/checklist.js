const express = require('express');
const router = express.Router();
const checkController = require('../controllers/checkController');
const conexao = require('../db'); // Banco de dados

// Página de checklist (cadastro de checklist)
router.get('/', (req, res) => {
    res.render('checklist'); // página checklist.handlebars
});

// Cadastro de novo checklist
router.post('/cadastrar', (req, res) => {
    const {
        eletrica, hidraulica, esgoto, pintura,
        eletrodomestico, eletroeletronico, moveis,
        porta, janela, arcondicionado, outros
    } = req.body;

    const dataAtual = new Date();
    const fusoHorarioBrasil = new Date(dataAtual.getTime() - (3 * 60 * 60 * 1000));
    const dataFormatada = fusoHorarioBrasil.toISOString().slice(0, 19).replace('T', ' ');


    const query = `
        INSERT INTO chec (data, eletrica, hidraulica, esgoto, pintura, 
            eletrodomestico, eletroeletronico, moveis, porta, janela, 
            arcondicionado, outros) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    conexao.query(query, [
        dataAtual, eletrica, hidraulica, esgoto, pintura,
        eletrodomestico, eletroeletronico, moveis,
        porta, janela, arcondicionado, outros
    ], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao cadastrar checklist:', erro);
            return res.status(500).send('Erro ao cadastrar');
        }
        res.redirect('/checklist');
    });
});

// Página de relatório de checklist
router.get('/relatchecklist', checkController.paginaRelatChecklist);

// Buscar dados de checklist filtrado
router.get('/relatchecklist/dados', checkController.buscarChecklist);

module.exports = router;
