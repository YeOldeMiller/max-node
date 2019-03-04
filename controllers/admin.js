const { validationResult } = require('express-validator/check');

const Product = require('../models/product');

exports.getProducts = (req, res) => {
  Product.find({ createdBy: req.session.user._id })
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
      res.render('admin/edit-product', { 
        product,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editMode
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/admin/products');
    });
};

exports.postAddProduct = (req, res) => {
  errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', { 
      product: req.body.product,
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      errorMsg: errors.array().map(err => err.msg),
      validationErrors: errors.array(),
      hasError: true
    });
  }
  req.body.product.createdBy = req.session.user;
  const product = new Product(req.body.product);
  product.save()
    .then(() => res.redirect('/admin/products'))
    .catch(console.log);
};

exports.postEditProduct = async (req, res) => {
  try {
    errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', { 
        product: req.body.product,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        errorMsg: errors.array().map(err => err.msg),
        validationErrors: errors.array(),
        editMode: true,
        hasError: true
      });
    }
    const { name, imageUrl, description, price } = req.body.product;
    const product = await Product.findById(req.body.productId);
    if(product.createdBy.toString() !== req.session.user._id.toString()) {
      req.flash('error', 'You do not have permission to edit this item');
    } else {
      product.name = name;
      product.imageUrl = imageUrl,
      product.description = description;
      product.price = price;
      await product.save();
    }
    res.redirect('/admin/products');
  } catch(err) {
    console.log(err);
  }
}

exports.postDeleteProduct = (req, res) => {
  Product.deleteOne({ _id: req.body.productId, createdBy: req.session.user._id })
    .then(() => res.redirect('/admin/products'))
    .catch(console.log);
};