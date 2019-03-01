const Product = require('../models/product'),
  Cart = require('../models/cart');


exports.getIndex = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list',
        {
          products,
          pageTitle: 'All Products',
          path: '/'
        });
      })
    .catch(console.log);
};

exports.getProducts = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list',
        {
          products,
          pageTitle: 'All Products',
          path: '/products'
        });
      })
    .catch(console.log);
};

exports.getProductDetails = (req, res) => {
  Product.findByPk(req.params.productId)
    .then(product => res.render('shop/product-details',
      {
        product,
        pageTitle: product.name,
        path: '/products'
      }
    ))
    .catch(console.log);
};

exports.getCart = (req, res) => {
  req.user.getCart()
    .then(cart => cart.getProducts())
    .then(products => res.render('shop/cart',
      {
        products,
        // total: cart.total,
        path: '/cart',
        pageTitle: 'Your Cart'
      }
    ))
    .catch(console.log);
};

// exports.postRemoveItem = (req, res) => {
//   const id = req.body.productId;
//   Product.findById(id, product => {
//     Cart.addProduct(id, product.price);
//   });
//   res.redirect('/cart');
// };

exports.postCart = async (req, res) => {
  try {
    const id = req.body.productId,
      cart = await req.user.getCart();
    let [ product ] = await cart.getProducts({ where: { id } });
    let qty = 1;
    if(product) {
      qty += product.cartItem.qty;
    } else {
      product = await Product.findByPk(req.body.productId);
    }
    await cart.addProduct(product, { through: { qty } });
    res.redirect('/cart');
  } catch(err) {
    console.log(err);
  }
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