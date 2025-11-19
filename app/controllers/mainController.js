const mainController = {
  // main page
  homePage(_, res) {
    res.send('home');
  },

  error404(req, res) {
    res.status(404).render('error404', { url: req.url });
  },

  showLoginPage(_, res) {
    res.send('loginpage');
  },

  logout(req, res) {
    delete req.session.login;
    res.send('deconnexion réussi');
  },
};

module.exports = mainController;
