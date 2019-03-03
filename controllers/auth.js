const User = require('../models/user');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Sign in',
    auth: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res) => {
  User.findById('5c7b6bb49bfac937dcacff37')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return;
    })
    .then(() => res.redirect('/'))
    .catch(console.log);
}

exports.postLogout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
}