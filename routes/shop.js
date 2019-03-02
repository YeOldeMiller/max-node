const express = require('express'),
  router = express.Router();

const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProductDetails);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/remove-cart-item', shopController.postRemoveCartItem);
router.get('/orders', shopController.getOrders);
router.post('/create-order', shopController.postOrder);

module.exports = router;