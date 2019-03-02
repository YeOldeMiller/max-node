const Product = require('../models/product');

exports.getProducts = (req, res) => {
  Product.fetchAll()
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
  Product.findById(req.params.productId)
    .then(product => {
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

// exports.postAddProduct = (req, res) => {
//   const product = new Product(req.body.product);
//   product.save()
//     .then(res.redirect('/admin/products'))
//     .catch(console.log);
// };

exports.postEditProduct = (req, res) => {
  const product = new Product(req.body.product, req.user._id);
  product.save()
    .then(res.redirect('/admin/products'))
    .catch(console.log);
}

exports.postDeleteProduct = (req, res) => {
  Product.deleteById(req.body.productId)
    .then(res.redirect('/admin/products'));
};