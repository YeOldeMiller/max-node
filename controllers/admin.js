const fs = require('fs');

const { validationResult } = require('express-validator/check');

const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
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
    .catch(next);
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
    .catch(() => res.redirect('/admin/products'));
};

exports.postAddProduct = (req, res, next) => {
  const errors = validationResult(req),
    errorMsg = errors.array().map(err => err.msg);
  if(!req.file) errorMsg.push('File format is not supported');
  if(errorMsg.length) {
    return res.status(422).render('admin/edit-product', { 
      product: req.body.product,
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      errorMsg,
      validationErrors: errors.array(),
      hasError: true
    });
  }
  req.body.product.createdBy = req.session.user;
  req.body.product.imageUrl = req.file.path.replace('\\', '/');
  const product = new Product(req.body.product);
  product.save()
    .then(() => res.redirect('/admin/products'))
    .catch(next);
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
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
    const { name, description, price } = req.body.product,
      image = req.file;
    const product = await Product.findById(req.body.productId);
    if(product.createdBy.toString() !== req.session.user._id.toString()) {
      req.flash('error', 'You do not have permission to edit this item');
    } else {
      product.name = name;
      product.description = description;
      product.price = price;
      if(image) {
        fs.unlink(product.imageUrl, err => err && console.log(err));
        product.imageUrl = image.path.replace('\\', '/');
      }
      await product.save();
    }
    res.redirect('/admin/products');
  } catch(err) {
    next(err);
  }
}

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);
    if(!product) throw new Error('Product not found');
    fs.unlink(product.imageUrl, err => err && console.log(err))
    await Product.deleteOne({ _id: req.body.productId, createdBy: req.user._id })
    res.redirect('/admin/products');
  } catch(err) {
    next(err);
  }
};