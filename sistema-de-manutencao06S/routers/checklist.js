const express = require('express');
const router = express.Router();
const conexao = require('../db'); // conexão com banco

// ROTA PARA EXIBIR FORMULÁRIO DE CHECKLIST
router.get('/', (req, res) => {
    res.render('checklist'); // renderiza checklist.handlebars
});

// ROTA PARA CADASTRAR CHECKLIST NO BANCO
router.post('/cadastrar', (req, res) => {
    const {
        eletrica, hidraulica, esgoto, pintura,
        eletrodomestico, eletroeletronico, moveis,
        porta, janela, arcondicionado, outros
    } = req.body;

    const dataAtual = new Date().toISOString().split('T')[0];

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

router.get('/relatchecklist', (req, res) => {
    res.render('relatChecklist', {
        mostrarMenu: true // ou qualquer variável que você deseje passar
    });
});

module.exports = router;
