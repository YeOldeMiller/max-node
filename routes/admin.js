const express = require('express'),
  router = express.Router();

const adminController = require('../controllers/admin'),
  { isAuthenticated } = require('./middleware');

router.get('/add-product', isAuthenticated, adminController.getAddProduct);
router.get('/products', adminController.getProducts);
router.post('/add-product', isAuthenticated, adminController.postAddProduct);
router.get('/edit-product/:productId', isAuthenticated, adminController.getEditProduct);
router.post('/edit-product', isAuthenticated, adminController.postEditProduct);
router.post('/delete-product', isAuthenticated, adminController.postDeleteProduct);

module.exports = router;