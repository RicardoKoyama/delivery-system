const usuariosService = require('../../services/usuarios.service');

async function viewLogin(req, res) {
  res.render('login', { error: null });
}

async function doLogin(req, res) {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.render('auth/login', { error: 'Informe usuário e senha.' });
  }

  console.log('Requisição de login para usuário:', usuario);

  const user = await usuariosService.autenticar(usuario, senha);

  if (!user) {
    return res.render('auth/login', { error: 'Usuário ou senha inválidos.' });
  }

  req.session.user = user;
  res.redirect('/dashboard');
}

async function doLogout(req, res) {
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao destruir sessão:', err);
      return res.redirect('/');
    }

    res.clearCookie('anotabot_sid');
    res.redirect('/login');
  });
}

module.exports = { authController: { viewLogin, doLogin, doLogout } };
