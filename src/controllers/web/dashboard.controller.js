async function index(req, res) {
  res.render('painel/dashboard');
}

module.exports = { dashboardController: { index } };
