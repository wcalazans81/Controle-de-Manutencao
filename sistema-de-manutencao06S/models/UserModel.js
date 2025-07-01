const conexao = require('../db');

module.exports = {
  // Criar novo usuário
  create: (usuario, cb) => {
    const sql = `
      INSERT INTO usuarios_1 (
        nome_1, email_1, senha_1, aprovado_1
      ) VALUES (?, ?, ?, ?)
    `;
    conexao.query(sql, [
      usuario.nome_1,
      usuario.email_1,
      usuario.senha_1,
      usuario.aprovado_1
    ], cb);
  },

  // Buscar por e-mail
  findByEmail: (email_1, cb) => {
    const sql = 'SELECT * FROM usuarios_1 WHERE email_1 = ?';
    conexao.query(sql, [email_1], (err, results) => {
      if (err) return cb(err);
      cb(null, results[0]);
    });
  },

  // Buscar por token de recuperação
  findByToken: (token, cb) => {
    const sql = `
      SELECT * FROM usuarios_1
      WHERE token_recuperacao_ = ? AND token_expira_ > NOW()
    `;
    conexao.query(sql, [token], (err, results) => {
      if (err) return cb(err);
      cb(null, results[0]);
    });
  },

  // Atualizar token de recuperação
  updateToken: (id, token, expira, cb) => {
    const sql = `
      UPDATE usuarios_1
      SET token_recuperacao_ = ?, token_expira_ = ?
      WHERE id = ?
    `;
    conexao.query(sql, [token, expira, id], cb);
  },

  // Resetar senha e limpar token
  resetSenha: (id, hash, cb) => {
    const sql = `
      UPDATE usuarios_1
      SET senha_1 = ?, token_recuperacao_ = NULL, token_expira_ = NULL
      WHERE id = ?
    `;
    conexao.query(sql, [hash, id], cb);
  },

  // Log de acesso
  logAcesso: (id, ip, navegador, cb) => {
    const sql = `
      INSERT INTO logs_acesso_1 (usuario_id_1, ip_1, navegador_1, data_hora_1)
      VALUES (?, ?, ?, NOW())
    `;
    conexao.query(sql, [id, ip, navegador], cb);
  },

  // Listar usuários pendentes
  listPendentes: (cb) => {
    const sql = `
      SELECT id, nome_1, email_1
      FROM usuarios_1
      WHERE aprovado_1 = 0
    `;
    conexao.query(sql, cb);
  },

  // Aprovar usuário
  approve: (id, cb) => {
    const sql = 'UPDATE usuarios_1 SET aprovado_1 = 1 WHERE id = ?';
    conexao.query(sql, [id], cb);
  },

  // Buscar nome e email por ID
  findById: (id, cb) => {
    const sql = 'SELECT nome_1, email_1 FROM usuarios_1 WHERE id = ?';
    conexao.query(sql, [id], (err, results) => {
      if (err) return cb(err);
      cb(null, results[0]);
    });
  }
};
