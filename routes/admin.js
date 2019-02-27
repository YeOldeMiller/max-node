const express = require('express'),
  router = express.Router();

const adminController = require('../controllers/admin');

router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getProducts);

router.post('/add-product', adminController.postAddProduct);

module.exports = router;