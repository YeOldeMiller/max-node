const Product = require('../models/product'),
  Cart = require('../models/cart');

exports.getProducts = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products',
        {
          products,
          path: '/admin/products',
          pageTitle: 'Product Manager'
        }
      );
    })
    .catch(console.log);
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
  const editMode = req.query.edit === 'true';
  req.user.getProducts({ where: { id: req.params.productId } })
    .then(([ product ]) => {
      res.render('admin/edit-product',
        { 
          product,
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editMode
        }
      );
    })
    .catch(err => {
      console.log(err);
      res.redirect('/admin/products');
    });
};

exports.postAddProduct = (req, res) => {
  req.user.createProduct(req.body.product)
    .then(res.redirect('/admin/products'))
    .catch(console.log);
};

exports.postEditProduct = (req, res) => {
  Product.update(req.body.product, { where: { id: req.body.product.id, userId: req.user.id } })
    .then(() => res.redirect('/admin/products'))
    .catch(console.log);
}

exports.postDeleteProduct = (req, res) => {
  Product.destroy({ where: { id: req.body.productId } })
    .then(() => {
      res.redirect('/admin/products');
    });
};