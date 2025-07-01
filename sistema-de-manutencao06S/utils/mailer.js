require('dotenv').config();
const nodemailer = require('nodemailer');

// Cria o transporter usando variáveis do .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Testa conexão com o SMTP ao iniciar (opcional, útil para debug)
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erro ao configurar o mailer:', error);
  } else {
    console.log('✅ Mailer pronto para enviar e-mails');
  }
});

module.exports = transporter;

