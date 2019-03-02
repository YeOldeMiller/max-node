const Product = require('../models/product');

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

exports.postRemoveCartItem = (req, res) => {
  const id = req.body.productId;
  req.user.getCart()
    .then(cart => cart.getProducts({ where: { id } }))
    .then(([ product ]) => product.cartItem.destroy())
    .then(() => res.redirect('/cart'))
    .catch(console.log);
};

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
  req.user.getOrders({ include: [ 'products' ] })
    .then(orders => res.render('shop/orders',
      {
        orders,
        path: '/orders',
        pageTitle: 'Your Orders'
      }
    )
  )
  .catch(console.log);
};

// exports.getCheckout = (req, res) => {
//   res.render('shop/checkout',
//     {
//       path: '/checkout',
//       pageTitle: 'Checkout'
//     }
//   );
// };

exports.postOrder = async (req, res) => {
  try {
    const cart = await req.user.getCart(),
      products = await cart.getProducts(),
      order = await req.user.createOrder();
    await order.addProducts(products.map(product => {
      product.orderItem = { qty: product.cartItem.qty };
      return product;
    }));
    await cart.setProducts(null);
    res.redirect('/orders');
  } catch(err) {
    console.log(err);
  }
}