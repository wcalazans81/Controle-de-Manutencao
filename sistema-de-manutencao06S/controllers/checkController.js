const db = require('../db');


exports.buscarChecklist = (req, res) => {
    const { mes, ano } = req.query;
    const anoAtual = new Date().getFullYear();
    let sql = 'SELECT * FROM chec WHERE ';
    let params = [];

    if (mes && !ano) {
        sql += 'MONTH(data) = ? AND YEAR(data) = ?';
        params.push(mes, anoAtual);
    } else if (mes && ano) {
        sql += 'MONTH(data) = ? AND YEAR(data) = ?';
        params.push(mes, ano);
    } else {
        return res.json([]);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Erro ao buscar checklist:', err);
            return res.status(500).json({ erro: 'Erro ao buscar dados' });
        }

        // Antes de mandar para o front, limpa resultados inválidos
        const dadosFiltrados = results.filter(item => item && Object.keys(item).length > 0 && item.data);

        res.json(dadosFiltrados);

    });
};

exports.paginaRelatChecklist = (req, res) => {
    res.render('/relatChecklist', {
        mostrarMenu: true // ativa o botão menu nessa página
    });
};
