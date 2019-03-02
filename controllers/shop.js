const Product = require('../models/product');

exports.getIndex = (req, res) => {
  Product.fetchAll()
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
  Product.fetchAll()
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
  req.user.getCart()
    .then(products => res.render('shop/cart',
      {
        products,
        // total: cart.total,
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
    .then(() => res.redirect('/cart'));
};

exports.getOrders = (req, res) => {
  req.user.getOrders()
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

// // exports.getCheckout = (req, res) => {
// //   res.render('shop/checkout',
// //     {
// //       path: '/checkout',
// //       pageTitle: 'Checkout'
// //     }
// //   );
// // };

exports.postOrder = (req, res) => {
  req.user.addOrder()
    .then(res.redirect('/orders'))
    .catch(console.log);
}