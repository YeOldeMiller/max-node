const path = require('path');

const express = require('express'),
  router = express.Router();

const rootDir = require('../util/path');
const products = require('./admin').products;

router.get('/', (req, res) => {
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  res.render('shop', { products, pageTitle: 'Shop', path: req.url });
});

module.exports = router;