const conexao = require('../db');
const socketUtils = require('../utils/socket');
const io = socketUtils.getIO();

// Cadastro de pedido
exports.cadastrarPedido = (req, res) => {
  let { empresa, nome, setor, descricao } = req.body;
  // Função para normalizar strings
  const normalizar = (str) =>
    str
      .normalize("NFD")                            // separa acento de letra
      .replace(/[\u0300-\u036f]/g, "")             // remove acentos
      .replace(/\s+/g, " ")                        // reduz múltiplos espaços para um só
      .trim()                                      // remove espaços início/fim
      .toUpperCase();                              // tudo maiúsculo
  // Normaliza todos os campos
  empresa = normalizar(empresa);
  nome = normalizar(nome);
  setor = normalizar(setor);
  descricao = normalizar(descricao);

  // Empresas válidas (todas já normalizadas)
  const empresasValidas = ['AFFEMG', 'FUNDAFFEMG', 'FISCO CORRETORA'];

  // Validação
  if (!empresasValidas.includes(empresa)) {
    return res.render("index", {
      alerta: "ERRO! A empresa deve ser AFFEMG, FUNDAFFEMG ou FISCO CORRETORA.",
    });
  }
  const dataAtual = new Date();
  const data = new Date(dataAtual.getTime() - (3 * 60 * 60 * 1000)) // Ajusta para -3h (Brasília)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  const sql = `INSERT INTO servico (empresa, nome, setor, data, descricao) VALUES (?, ?, ?, ?, ?)`;
  conexao.query(sql, [empresa, nome, setor, data, descricao], (erro) => {
    if (erro) {
      console.error("Erro ao cadastrar:", erro);
      return res.render("index", { alerta: "Erro ao salvar os dados." });
    }
    io.emit("atualizarPedidos"); // 🔄 Notifica todos os clientes
    res.render("index", { alerta: "Pedido salvo com sucesso!" });
  });
};

// Editar pedido (GET)
exports.editarPedidoGet = (req, res) => {
  const sql = `SELECT * FROM servico WHERE id = ?`;
  conexao.query(sql, [req.params.id], (erro, retorno) => {
    if (erro || retorno.length === 0) {
      console.error("Erro ao buscar pedido:", erro);
      return res.status(500).send('Erro ao buscar pedido.');
    }
    res.render('pedidoEditar', { pedido: retorno[0] });
  });
};

// Editar pedido (POST)
exports.editarPedidoPost = (req, res) => {
  const { id, empresa, nome, setor, descricao } = req.body;
  const empresasValidas = ['AFFEMG', 'FUNDAFFEMG', 'FISCO CORRETORA'];
  if (!empresasValidas.includes(empresa.toUpperCase())) {
    return res.render("index", { alerta: "ERRO! Empresa inválida." });
  }
  const dataAtual = new Date();
  const data = new Date(dataAtual.getTime() - (3 * 60 * 60 * 1000)) // Ajuste de fuso horário
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  const sqlUpdate = `UPDATE servico SET empresa=?, nome=?, setor=?, data=?, descricao=? WHERE id=?`;
  conexao.query(sqlUpdate, [empresa, nome, setor, data, descricao, id], (erroUpdate) => {
    if (erroUpdate) {
      console.error("Erro UPDATE:", erroUpdate);
      return res.status(500).send("Erro ao atualizar pedido.");
    }
    res.redirect('/');
    setTimeout(() => {
      io.emit('atualizarPedidos');
    }, 100); // evita conflito com o res.redirect

  });
};

// Excluir pedido com histórico
exports.excluirPedido = (req, res) => {
  const id = req.params.id;

  // Buscar pedido antes de excluir
  const sqlSelect = 'SELECT * FROM servico WHERE id = ?';
  conexao.query(sqlSelect, [id], (erroSelect, rows) => {
    if (erroSelect || rows.length === 0) {
      return res.status(500).send('Erro ao buscar pedido.');
    }
    const pedido = rows[0];

    const sqlInsert = `INSERT INTO relat (empres, nom, seto, dat, descric) VALUES (?, ?, ?, ?, ?)`;
    conexao.query(sqlInsert, [pedido.empresa, pedido.nome, pedido.setor, pedido.data, pedido.descricao], (erroInsert) => {
      if (erroInsert) {
        return res.status(500).send('Erro ao salvar no histórico.');
      }

      const sqlDelete = `DELETE FROM servico WHERE id = ?`;
      conexao.query(sqlDelete, [id], (erroDelete) => {
        if (erroDelete) {
          return res.status(500).send('Erro ao excluir pedido.');
        }
        io.emit("atualizarPedidos"); // 🔄 Notifica todos os clientes
        res.redirect('/');
      });
    });
  });
};
