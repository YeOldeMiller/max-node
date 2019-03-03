const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Sign in'
  });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body.user,
      user = await User.findOne({ email });
    if(user && await bcrypt.compare(password, user.password)) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save(err => {
        err && console.log(err);
        return res.redirect('/');
      });
    }
    req.flash('error', 'Invalid email or password');
    res.redirect('/login');
  } catch(err) {
    console.log(err);
  }
}

exports.postLogout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
}

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign up'
  });
};

exports.postSignup = async (req, res) => {
  try {
    const { email, password } = req.body.user;
    if(await User.findOne({ email })) {
      req.flash('error', 'Email address already in use');
      return res.redirect('/signup');
    }
    const user = new User({
      email,
      password: await bcrypt.hash(password, 12),
      cart: { items: [] }
    });
    await user.save();
    res.redirect('/login');
  } catch(err) {
    console.log(err);
  }
}