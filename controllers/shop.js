const Product = require('../models/product');

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
  Product.fetchAll(products => {
    const foundProduct = products.find(p => p.id === req.params.productId);
    res.render('shop/product-details',
      {
        product: foundProduct,
        pageTitle: 'Product Details',
        path: '/product-details'
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
        path: req.url
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