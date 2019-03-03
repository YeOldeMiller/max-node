const express = require('express'),
  router = express.Router();

const shopController = require('../controllers/shop'),
  { isAuthenticated } = require('./middleware');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProductDetails);
router.get('/cart', isAuthenticated, shopController.getCart);
router.post('/cart', isAuthenticated, shopController.postCart);
router.post('/remove-cart-item', isAuthenticated, shopController.postRemoveCartItem);
router.get('/orders', isAuthenticated, shopController.getOrders);
router.post('/create-order', isAuthenticated, shopController.postOrder);

module.exports = router;