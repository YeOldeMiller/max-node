const Product = require('../models/product'),
  Order = require('../models/order');

exports.getIndex = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/index',
        {
          products,
          pageTitle: 'All Products',
          path: '/'
        });
      })
    .catch(console.log);
};

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list',
        {
          products,
          pageTitle: 'All Products',
          path: '/products'
        });
      })
    .catch(console.log);
};

exports.getProductDetails = (req, res) => {
  Product.findById(req.params.productId)
    .then(product => res.render('shop/product-details',
      {
        product,
        pageTitle: product.name,
        path: '/products'
      }
    ))
    .catch(console.log);
};

exports.getCart = (req, res) => {
  req.user.populate('cart.items.product')
    .execPopulate()
    .then(user => res.render('shop/cart',
      {
        products: user.cart.items,
        path: '/cart',
        pageTitle: 'Your Cart'
      }
    ))
    .catch(console.log);
};

exports.postRemoveCartItem = (req, res) => {
  req.user.removeFromCart(req.body.productId)
    .then(() => res.redirect('/cart'))
    .catch(console.log);
};

exports.postCart = (req, res) => {
  Product.findById(req.body.productId)
    .then(product => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
    .catch(console.log);
};

exports.getOrders = (req, res) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => res.render('shop/orders',
      {
        orders,
        path: '/orders',
        pageTitle: 'Your Orders'
      }
    )
  )
  .catch(console.log);
};

exports.postOrder = async (req, res) => {
  try {
    const user = await req.user.populate('cart.items.product').execPopulate();
    const order = new Order({
      products: user.cart.items.map(i => (
        { quantity: i.quantity, product: { ...i.product._doc } }
      )),
      user: {
        userId: req.user,
        username: req.user.username
      }
    })
    await order.save();
    await req.user.clearCart();
    res.redirect('/orders');
  } catch(err) {
    console.log(err);
  }
}