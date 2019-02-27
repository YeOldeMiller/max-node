const Product = require('../models/product');

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('admin/products',
      {
        products,
        path: '/admin/products',
        pageTitle: 'Product Manager'
      }
    );
  });
};

exports.getAddProduct = (req, res) => {
  res.render('admin/add-product',
    { 
      pageTitle: 'Add Product',
      path: '/admin/add-product'
    }
  );
};

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body.product);
  product.save();
  res.redirect('/');
};