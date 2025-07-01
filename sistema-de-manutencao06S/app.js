require('dotenv').config();

// Core
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const socketUtils = require('./utils/socket'); // <- NOVO

// Middleware e utilitários
const fileupload = require('express-fileupload');
const session = require('express-session');
const useragent = require('express-useragent');
const exphbs = require('express-handlebars');
const moment = require('moment');
const mailer = require('./utils/mailer');
moment.locale('pt-br');
const { verificaAutenticado } = require('./utils/authMiddleware');

const app = express();

const server = http.createServer(app);
const io = new Server(server);
//const socketUtils = require('./utils/socket');
socketUtils.setIO(io); // registra globalmente o io


// Teste de envio de e-mail
app.get('/teste-email', async (req, res) => {
  try {
    await mailer.sendMail({
      from: `"Sistema AFFEMG" <${process.env.EMAIL_USER}>`,
      to: 'destino@exemplo.com',
      subject: 'Teste de envio de email',
      text: 'Este é um email de teste enviado pelo sistema.',
    });
    res.send('Email enviado com sucesso!');
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    res.status(500).send('Falha ao enviar email.');
  }
});

// Middleware - requisições
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileupload());
app.use(useragent.express());

// Sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'chaveSeguraAleatoria123@!',
  resave: false,
  saveUninitialized: false,
}));

// Mensagens de sessão
app.use((req, res, next) => {
  res.locals.success_msg = req.session.success_msg || null;
  res.locals.error_msg = req.session.error_msg || null;
  delete req.session.success_msg;
  delete req.session.error_msg;
  next();
});

// Usuário logado
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Handlebars
const hbs = exphbs.create({
  helpers: {
    formatDate: (data) => {
      return data ? moment(data).format('DD/MM/YYYY HH:mm:ss') : '';
    }
  },
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  defaultLayout: 'main',
  extname: '.handlebars'
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', true);

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// Banco de dados
const conexao = require('./db.js');



// Rotas
const authRouter = require('./routers/authRouter');
//const checkRoutes = require('./routers/checkRoutes');
const relatorioRouter = require('./routers/relatorio');
const estoqueRouter = require('./routers/estoqueRouter');
const checklistRouter = require('./routers/checklist');
const relatChecklistRouter = require('./routers/relatChecklist');
const sobreNosRouter = require('./routers/sobreNos');
const pedidoRouter = require('./routers/pedidoRouter');
// Log de todas as requisições recebidas
/*app.use((req, res, next) => {
  console.log(`📩 Requisição: ${req.method} ${req.originalUrl}`);
  next();
});*/

app.use('/', authRouter);
//app.use('/', checkRoutes);
app.use('/relatorio', relatorioRouter);
app.use('/estoque', estoqueRouter);
app.use('/checklist', checklistRouter);
app.use('/relatchecklist', relatChecklistRouter);
app.use('/sobre-nos', sobreNosRouter);
app.use('/', pedidoRouter);

// Inicia servidor com Socket.IO
server.listen(3000, '0.0.0.0', () => {
  console.log('Servidor rodando com Socket.IO na porta 3000');
});


