const express = require('express'),
  router = express.Router();

const adminController = require('../controllers/admin');

router.get('/add-product', adminController.getAddProduct);
router.get('/products', adminController.getProducts);
router.post('/add-product', adminController.postEditProduct);
router.get('/edit-product/:productId', adminController.getEditProduct);
router.post('/edit-product', adminController.postEditProduct);
router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;