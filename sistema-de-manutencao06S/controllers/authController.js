// controllers/authController1.js
const bcrypt = require('bcrypt');
const moment = require('moment');
const UAParser = require('ua-parser-js');
const User = require('../models/UserModel');
const gerarToken = require('../utils/tokenGenerator');
const mailer = require('../utils/mailer');
const conexao = require('../db');

// Página de login
exports.loginPage = (req, res) => {
  res.render('login');
};

// Página de registro
exports.registerPage = (req, res) => {
  res.render('register');
};

// Página de recuperação
exports.forgotPasswordPage = (req, res) => {
  res.render('forgotPassword');
};

// Página de redefinição
exports.resetPasswordPage = (req, res) => {
  const token = req.params.token;
  User.findByToken(token, (err, user) => {
    if (err || !user) {
      req.session.error_msg = 'Token inválido ou expirado';
      return res.redirect('/recuperar');
    }
    res.render('resetPassword', { token });
  });
};

// Página de aprovação admin
exports.adminApprovalPage = (req, res) => {
  User.listPendentes((err, usuarios_1) => {
    if (err) {
      req.session.error_msg = 'Erro ao carregar usuários';
      return res.redirect('/');
    }
    res.render('adminApproval', { usuarios_1 });
  });
};

// Registro de usuário
exports.register = (req, res) => {
  const { nome_1, email_1, senha_1, confirmarSenha } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/;

  if (!nomeRegex.test(nome_1)) {
    req.session.error_msg = 'Nome inválido.';
    return res.redirect('/register');
  }

  if (!emailRegex.test(email_1)) {
    req.session.error_msg = 'E-mail inválido.';
    return res.redirect('/register');
  }

  if (senha_1 !== confirmarSenha) {
    req.session.error_msg = 'As senhas não coincidem.';
    return res.redirect('/register');
  }

  if (senha_1.length < 6) {
    req.session.error_msg = 'Senha muito curta.';
    return res.redirect('/register');
  }

  const dominio = email_1.split('@')[1];
  const aprovado_1 = (dominio === 'affemg.com.br');

  bcrypt.hash(senha_1, 10, (err, hash) => {
    if (err) {
      req.session.error_msg = 'Erro ao criptografar senha';
      return res.redirect('/register');
    }

    const usuario_1 = {
      nome_1,
      email_1,
      senha_1: hash,
      aprovado_1
    };

    User.create(usuario_1, (err2) => {
      if (err2) {
        req.session.error_msg = 'Erro ao registrar usuário';
        return res.redirect('/register');
      }

      req.session.success_msg = aprovado_1
        ? 'Cadastro aprovado automaticamente.'
        : 'Cadastro enviado. Aguarde aprovação.';

      res.redirect('/login');
    });
  });
};

// Login
exports.login = (req, res) => {
  const { email_1, senha_1 } = req.body;

  User.findByEmail(email_1, (err, usuario_1) => {
    if (err || !usuario_1) {
      req.session.error_msg = 'Usuário não encontrado';
      return res.redirect('/login');
    }

    if (!usuario_1.aprovado_1) {
      req.session.error_msg = 'Usuário não aprovado.';
      return res.redirect('/login');
    }

    bcrypt.compare(senha_1, usuario_1.senha_1, (erro, igual) => {
      if (!igual) {
        req.session.error_msg = 'Senha incorreta';
        return res.redirect('/login');
      }

      req.session.user = {
        id: usuario_1.id,
        nome: usuario_1.nome_1,
        email: usuario_1.email_1,
        is_admin: usuario_1.is_admin_
      };

      const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
      const parser = new UAParser(req.headers['user-agent']);
      const browserInfo = parser.getBrowser();
      const osInfo = parser.getOS();

      const browser = `${browserInfo.name || 'Navegador'} ${browserInfo.version?.split('.')[0] || ''} (${osInfo.name || ''} ${osInfo.version || ''})`;

      User.logAcesso(usuario_1.id, ip, browser, () => {});

      req.session.success_msg = 'Login realizado com sucesso';
      res.redirect(usuario_1.is_admin_ ? '/admin/dashboard' : '/');
    });
  });
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};

// Enviar link de recuperação
exports.sendResetLink = (req, res) => {
  const { email_1 } = req.body;

  User.findByEmail(email_1, (err, usuario_1) => {
    if (err || !usuario_1) {
      req.session.error_msg = 'E-mail não encontrado';
      return res.redirect('/recuperar');
    }

    const token = gerarToken();
    const expira = moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss');

    User.updateToken(usuario_1.id, token, expira, (err2) => {
      if (err2) {
        req.session.error_msg = 'Erro ao gerar token';
        return res.redirect('/recuperar');
      }

      const link = `http://${req.headers.host}/resetar/${token}`;
      const html = `<p>Clique no link para redefinir sua senha: <a href="${link}">${link}</a></p>`;

      mailer.sendMail({
        to: email_1,
        subject: 'Recuperação de Senha',
        html
      }, (err3) => {
        if (err3) {
          req.session.error_msg = 'Erro ao enviar e-mail';
          return res.redirect('/recuperar');
        }

        req.session.success_msg = 'Link enviado com sucesso.';
        res.redirect('/login');
      });
    });
  });
};

// Redefinir senha
exports.resetPassword = (req, res) => {
  const token = req.params.token;
  const { senha } = req.body;

  User.findByToken(token, (err, usuario_1) => {
    if (err || !usuario_1) {
      req.session.error_msg = 'Token inválido ou expirado';
      return res.redirect('/recuperar');
    }

    bcrypt.hash(senha, 10, (erroHash, hash) => {
      if (erroHash) {
        req.session.error_msg = 'Erro ao redefinir senha';
        return res.redirect(`/resetar/${token}`);
      }

      User.resetSenha(usuario_1.id, hash, () => {
        req.session.success_msg = 'Senha atualizada!';
        res.redirect('/login');
      });
    });
  });
};

// Aprovar usuário manualmente
exports.aprovarUsuario = async (req, res) => {
  const id = req.params.id;

  try {
    await conexao.promise().query('UPDATE usuarios_1 SET aprovado_1 = 1 WHERE id = ?', [id]);

    const [resultado] = await conexao.promise().query('SELECT nome_1, email_1 FROM usuarios_1 WHERE id = ?', [id]);
    const usuario = resultado[0];

    const html = `
      <p>Olá, <strong>${usuario.nome_1}</strong>.</p>
      <p>Seu cadastro foi aprovado pelo administrador.</p>
      <p><a href="http://${req.headers.host}/login">Clique aqui para fazer login</a>.</p>
    `;

    await mailer.sendMail({
      to: usuario.email_1,
      subject: 'Cadastro aprovado - AFFEMG',
      html
    });

    req.session.success_msg = 'Usuário aprovado e notificado!';
    res.redirect('/admin/aprovar');

  } catch (error) {
    console.error('Erro ao aprovar usuário:', error);
    req.session.error_msg = 'Erro ao aprovar usuário.';
    res.redirect('/admin/aprovar');
  }
};

// Logs de acesso
exports.verLogsAcesso = (req, res) => {
  const sql = `
    SELECT l.id, u.nome_1 AS nome, u.email_1 AS email, l.ip_1 AS ip, l.navegador_1 AS navegador, l.data_hora_1 AS data_hora
    FROM logs_acesso_1 l
    JOIN usuarios_1 u ON l.usuario_id_1 = u.id
    ORDER BY l.data_hora_1 DESC
  `;

  conexao.query(sql, (err, resultados) => {
    if (err) {
      req.session.error_msg = 'Erro ao buscar logs de acesso.';
      return res.redirect('/admin/dashboard');
    }

    resultados.forEach(log => {
      log.data_hora = new Date(log.data_hora);
    });

    res.render('adminLogs', { logs: resultados });
  });
};
