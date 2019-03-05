const fs = require('fs'),
  path = require('path');

const PDFDocument = require('pdfkit');

const Product = require('../models/product'),
  Order = require('../models/order');

const ITEMS_PER_PAGE = 2;

exports.getIndex = async (req, res, next) => {
  const prodCount = await Product.find().countDocuments(),
    page = parseInt(req.query.page) || 1,
    products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
  res.render('shop/index', {
    products,
    pageTitle: 'Shop',
    path: '/',
    currentPage: page,
    nextPage: ITEMS_PER_PAGE * page < prodCount && page + 1,
    prevPage: page > 2 && page - 1,
    lastPage: Math.ceil(prodCount / ITEMS_PER_PAGE)
  });
};

exports.getProducts = async (req, res, next) => {
  const prodCount = await Product.find().countDocuments(),
    page = parseInt(req.query.page) || 1,
    products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
  res.render('shop/index', {
    products,
    pageTitle: 'All Products',
    path: '/products',
    currentPage: page,
    nextPage: ITEMS_PER_PAGE * page < prodCount && page + 1,
    prevPage: page > 2 && page - 1,
    lastPage: Math.ceil(prodCount / ITEMS_PER_PAGE)
  });
};

exports.getProductDetails = (req, res, next) => {
  Product.findById(req.params.productId)
    .then(product => res.render('shop/product-details', {
      product,
      pageTitle: product.name,
      path: '/products'
    }))
    .catch(next);
};

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.product')
    .execPopulate()
    .then(user => res.render('shop/cart', {
      products: user.cart.items,
      path: '/cart',
      pageTitle: 'Your Cart'
    }))
    .catch(next);
};

exports.postRemoveCartItem = (req, res, next) => {
  req.user.removeFromCart(req.body.productId)
    .then(() => res.redirect('/cart'))
    .catch(next);
};

exports.postCart = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
    .catch(next);
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.session.user._id })
    .then(orders => res.render('shop/orders', {
      orders,
      path: '/orders',
      pageTitle: 'Your Orders'
    }))
    .catch(next);
};

exports.postOrder = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.product').execPopulate();
    const order = new Order({
      products: user.cart.items.map(i => (
        { quantity: i.quantity, product: { ...i.product._doc } }
      )),
      user: {
        userId: req.session.user,
        email: req.session.user.email
      }
    })
    await order.save();
    await req.user.clearCart();
    res.redirect('/orders');
  } catch(err) {
    next(err);
  }
};

exports.getInvoice = async (req, res, next) => {
  const orderId = req.params.orderId,
    invoiceName = 'invoice-' + orderId + '.pdf',
    invoicePath = path.join('data', invoiceName),
    order = await Order.findById(orderId);
  if(!order) return next(new Error('No order found'));
  if(order.user.userId.toString() !== req.user._id.toString()) {
    return next(new Error('Unauthorized'));
  }
  const pdf = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);
  pdf.pipe(fs.createWriteStream(invoicePath));
  pdf.pipe(res);
  pdf.fontSize(26).text('Invoice', { underline: true, align: 'center' });
  order.products.forEach((p, i) => (
    pdf.text(`${i + 1}. ${p.product.name} x ${p.quantity}: $${p.product.price * p.quantity}`)
  ));
  pdf.fontSize(20).text(`Total: $${order.products.reduce((acc, cur) => acc + cur.product.price * cur.quantity, 0)}`);
  pdf.end();
};