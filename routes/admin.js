const express = require('express'),
  router = express.Router(),
  { check } = require('express-validator/check');

const adminController = require('../controllers/admin'),
  { isAuthenticated } = require('./middleware');

const productValidation = [
  check('product[name]', 'Invalid name').trim().isString().isLength({ min: 3 }),
  // check('product[imageUrl]', 'Invalid URL').isURL(),
  check('product[price]', 'Invalid price').isFloat(),
  check('product[description]', 'Invalid description').trim().isLength({ min: 5, max: 200 })
];

router.get('/add-product', isAuthenticated, adminController.getAddProduct);
router.get('/products', adminController.getProducts);
router.post('/add-product', productValidation, isAuthenticated, adminController.postAddProduct);
router.get('/edit-product/:productId', isAuthenticated, adminController.getEditProduct);
router.post('/edit-product', productValidation, isAuthenticated, adminController.postEditProduct);
// router.post('/delete-product', isAuthenticated, adminController.postDeleteProduct);

router.delete('/product:productId', isAuthenticated, adminController.deleteProduct);

module.exports = router;