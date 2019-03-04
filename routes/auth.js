const express = require('express'),
  router = express.Router(),
  { check } = require('express-validator/check');

const authController = require('../controllers/auth'),
  User = require('../models/user');

router.get('/login', authController.getLogin);
router.post('/login', [
  check('user[email]').isEmail().withMessage('Invalid email').trim().normalizeEmail(),
  check('user[password]').trim().isLength({ min: 5 }).withMessage('Password too short')
], authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post(
  '/signup', [
  check('user[email]').isEmail().withMessage('Invalid email').trim().normalizeEmail()
    .custom((email, { req }) => {
      return User.findOne({ email }).then(user => {
        if(user) {
          return Promise.reject('Email already in use');
        }
      })
    }),
  check('user[password]').trim().isLength({ min: 5 }).withMessage('Password is too short'),
  check('user[confirmPassword]').trim().custom((value, { req }) => {
    if(value !== req.body.user.password) {
      throw new Error('Password fields do not match');
    }
    return true;
  }) ],
  authController.postSignup
);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getSetPass);
router.post('/set-pass', authController.postSetPass);

module.exports = router;