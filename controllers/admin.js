const Product = require('../models/product'),
  Cart = require('../models/cart');

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
  res.render('admin/edit-product',
    { 
      pageTitle: 'Add Product',
      path: '/admin/add-product'
    }
  );
};

exports.getEditProduct = (req, res) => {
  Product.findById(req.params.productId, product => {
    const editMode = req.query.edit === 'true';
    if(!product || !editMode) return res.redirect('/');
    res.render('admin/edit-product',
      { 
        product,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editMode
      }
    );
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body.product);
  product.save();
  res.redirect('/');
};

exports.postEditProduct = (req, res) => {
  const product = new Product(req.body.product);
  product.save();
  res.redirect('/admin/products')
}

exports.postDeleteProduct = (req, res) => {
  const id = req.body.productId;
  Product.findByIdAndRemove(id, err => {
    if(!err) Cart.deleteProduct(id);
    res.redirect('/admin/products');
  });
}