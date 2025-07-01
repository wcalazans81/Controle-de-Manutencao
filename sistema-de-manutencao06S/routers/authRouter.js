const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificaAdmin } = require('../utils/authMiddleware'); // Middleware correto
const { verificaAutenticado} = require('../utils/authMiddleware');
const conexao = require('../db'); 


// Página inicial (após login)
router.get('/', verificaAutenticado, (req, res) => {
  const sql = 'SELECT * FROM servico';
  conexao.query(sql, (erro, retorno) => {
    if (erro) {
      console.error('Erro ao buscar dados:', erro);
      return res.status(500).send('Erro ao carregar página inicial.');
    }
    res.render('index', { servico: retorno });
  });
});

// Rotas de autenticação
router.get('/login', authController.loginPage);
router.post('/login', authController.login);

router.get('/register', authController.registerPage);
router.post('/register', authController.register);

router.get('/logout', authController.logout);

// Recuperação de senha
router.get('/recuperar', authController.forgotPasswordPage);
router.post('/recuperar', authController.sendResetLink);

router.get('/resetar/:token', authController.resetPasswordPage);
router.post('/resetar/:token', authController.resetPassword);

// ROTAS DE ADMIN (Login de admin e aprovação)
router.post('/admin/login', (req, res) => {
  console.log('Body recebido:', req.body);
  const { adminUser, adminSenha } = req.body;

  if (adminUser.trim().toLowerCase() === 'calazans' && adminSenha.trim() === '12we4w5e') {
    req.session.user = {
      nome_1: 'Administrador',
      email_1: 'admin@affemg.com.br',
      is_admin_1: true
    };
    req.session.success_msg = 'Login de administrador realizado.';
    return res.redirect('/admin/dashboard'); // redireciona agora para o painel
  } else {
    req.session.error_msg = 'Credenciais inválidas.';
    return res.redirect('/admin/login');
  }
});
router.get('/admin/dashboard', verificaAdmin, (req, res) => {
  res.render('adminDashboard');
});
router.get('/admin/login', (req, res) => {
  res.render('adminLogin');
});

// Página para visualizar logs de acesso
router.get('/admin/logs', verificaAdmin, authController.verLogsAcesso);

// Tela de aprovação de usuários pendentes
router.get('/admin/aprovar', verificaAdmin, authController.adminApprovalPage);

// Aprovar usuário (POST com proteção admin)
router.post('/admin/aprovar/:id', verificaAdmin, authController.aprovarUsuario);

module.exports = router;
