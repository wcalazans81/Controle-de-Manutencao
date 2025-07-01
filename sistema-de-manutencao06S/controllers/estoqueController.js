const db = require('../db');

// Mostrar Itens
exports.listarItens = (req, res) => {
  const categorias = [
    { tabela: 'eletrica', nomeFormatado: 'Elétrica' },
    { tabela: 'hidraulica', nomeFormatado: 'Hidráulica' },
    { tabela: 'pintura', nomeFormatado: 'Pintura' },
    { tabela: 'ar_condicionado', nomeFormatado: 'Ar Condicionado' },
    { tabela: 'edificacao', nomeFormatado: 'Edificação' }
  ];

  const promises = categorias.map(cat => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT id, nome, quantidade, descricao, data FROM ${cat.tabela}`, (err, results) => {
        if (err) reject(err);
        else resolve({ nomeFormatado: cat.nomeFormatado, nomeTabela: cat.tabela, itens: results });
      });
    });
  });

  Promise.all(promises)
    .then(results => res.render('estoque', { categorias: results }))
    .catch(err => {
      console.error('Erro ao listar estoque:', err);
      res.status(500).send('Erro no servidor');
    });
};

// Adicionar Item
exports.adicionarItem = (req, res) => {
  const { categoria, nome, quantidade, descricao } = req.body;
  const tabelas = ['eletrica', 'hidraulica', 'pintura', 'ar_condicionado', 'edificacao'];

  if (!tabelas.includes(categoria)) return res.status(400).send('Categoria inválida');

  const dataAtual = new Date();
  dataAtual.setHours(dataAtual.getHours() - 3); // GMT-3
  const dataFormatada = dataAtual.toISOString().split('T')[0];

  const sql = `INSERT INTO ${categoria} (nome, quantidade, descricao, data) VALUES (?, ?, ?, ?)`;
  db.query(sql, [nome, quantidade, descricao, dataFormatada], err => {
    if (err) {
      console.error('Erro ao adicionar item:', err);
      return res.status(500).send('Erro ao adicionar item');
    }
    res.sendStatus(200);
  });
};

// Atualizar Quantidade
exports.atualizarQuantidade = (req, res) => {
  const { id, tabela, operacao } = req.body;
  const campo = operacao === 'incrementar' ? 'quantidade = quantidade + 1' : 'quantidade = quantidade - 1';

  const sql = `UPDATE ${tabela} SET ${campo} WHERE id = ?`;
  db.query(sql, [id], err => {
    if (err) {
      console.error('Erro ao atualizar item:', err);
      return res.status(500).send('Erro ao atualizar item');
    }
    res.sendStatus(200);
  });
};

// Excluir Item
exports.excluirItem = (req, res) => {
  const { id, tabela } = req.body;

  const sql = `DELETE FROM ${tabela} WHERE id = ?`;
  db.query(sql, [id], err => {
    if (err) {
      console.error('Erro ao excluir item:', err);
      return res.status(500).send('Erro ao excluir item');
    }
    res.sendStatus(200);
  });
};
