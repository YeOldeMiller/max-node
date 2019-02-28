const Product = require('../models/product'),
  Cart = require('../models/cart');

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop/product-list',
      {
        products,
        pageTitle: 'All Products',
        path: '/products'
      }
    );
  });
};

exports.getProductDetails = (req, res) => {
  Product.findById(req.params.productId, product => {
    if(!product) return res.redirect('/');
    res.render('shop/product-details',
      {
        product,
        pageTitle: product.name,
        path: '/products'
      }
    );
  });
};

exports.getIndex = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop/index',
      {
        products,
        pageTitle: 'Shop',
        path: '/'
      }
    );
  });
};

exports.getCart = (req, res) => {
  res.render('shop/cart',
    {
      path: '/cart',
      pageTitle: 'Your Cart'
    }
  );
};

exports.postCart = (req, res) => {
  const id = req.body.productId;
  Product.findById(id, product => {
    Cart.addProduct(id, product.price);
  });
  res.redirect('/cart');
};

exports.getOrders = (req, res) => {
  res.render('shop/orders',
    {
      path: '/orders',
      pageTitle: 'Your Orders'
    }
  );
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout',
    {
      path: '/checkout',
      pageTitle: 'Checkout'
    }
  );
};