const crypto = require('crypto');

const bcrypt = require('bcryptjs'),
  { createTransport } = require('nodemailer'),
  sendgridTransport = require('nodemailer-sendgrid-transport'),
  { validationResult } = require('express-validator/check');

const User = require('../models/user');

const transporter = createTransport(sendgridTransport({
  auth: { api_key: process.env.SENDGRID_API_KEY }
}));

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Sign in'
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body.user,
      errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Log in',
        errorMsg: errors.array().map(err => err.msg),
        validationErrors: errors.array(),
        prevInput: req.body.user
      });
    }
    const user = await User.findOne({ email });
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
    next(err);
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

exports.postSignup = async (req, res, next) => {
  try {
    const { email, password } = req.body.user,
      errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign up',
        errorMsg: errors.array().map(err => err.msg),
        validationErrors: errors.array(),
        prevInput: req.body.user,
      });
    }
    const user = new User({
      email,
      password: await bcrypt.hash(password, 12),
      cart: { items: [] }
    });
    await user.save();
    res.redirect('/login');
    transporter.sendMail({
      to: email,
      from: 'shop@max-node.com',
      subject: 'Account created',
      html: '<h1>You successfully signed up</h1>'
    });
  } catch(err) {
    next(err);
  }
};

exports.getReset = (req, res) => {
  res.render('auth/reset', {
    path: '/login',
    pageTitle: 'Reset password'
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if(err) {
      return res.redirect('/reset');
    }
    try{
      const user = await User.findOne({ email: req.body.user.email });
      if(!user) {
        req.flash('error', 'Account not found');
        return res.redirect('/reset');
      }
      user.resetToken = buffer.toString('hex');
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      res.redirect('/');
      transporter.sendMail({
        to: user.email,
        from: 'shop@max-node.com',
        subject: 'Password reset',
        html: `<p>You requested a password reset</p>
        <p> Click this <a href="http://localhost:3000/reset/${user.resetToken}">link</a> to set a new password</p>`
      });
    } catch(err) {
      next(err);
    }
  });
};

exports.getSetPass = async (req, res, next) => {
  try {
    const resetToken = req.params.token,
      user = await User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } });
    res.render('auth/set-pass', {
      path: '/set-pass',
      pageTitle: 'Set new password',
      userId: user._id.toString(),
      resetToken
    });
  } catch(err) {
    next(err);
  }
};

exports.postSetPass = async (req, res, next) => {
  try {
    const { password, _id, resetToken } = req.body.user,
      user = await User.findOne({ _id, resetToken, resetTokenExpiration: { $gt: Date.now() } });
    user.password = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.redirect('/login');
  } catch(err) {
    next(err);
  }
};