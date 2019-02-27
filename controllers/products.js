const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('add-product',
    { 
      pageTitle: 'Add Product',
      path: req.url
    }
  );
};

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body.name);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop',
      {
        products,
        pageTitle: 'Shop',
        path: req.url
      }
    );
  });
};