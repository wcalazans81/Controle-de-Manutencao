// utils/authMiddleware.js
exports.verificaAutenticado = (req, res, next) => {
  console.log('Usuário autenticado?', !!req.session.user);
  if (req.session.user) {
    return next();
  }
  return res.redirect('/login');
};


exports.verificaAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.is_admin_1) {
    return next();
  }
  req.session.error_msg = 'Acesso restrito ao administrador.';
  return res.redirect('/admin/login');
};

