const fs = require('fs'),
  path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

const getCartFromFile = cb => {
  fs.readFile(p, (err, content) => {
    if(err) return cb({ products: [], total: 0 });
    cb(JSON.parse(content));
  });
}

module.exports = class Cart {
  static addProduct(id, price) {
    getCartFromFile(cart => {
      const product = cart.products.find(p => p.id === id);
      if(product) {
        product.qty++;
      } else {
        cart.products.push({ id, qty: 1 });
      }
      cart.total += price;
      fs.writeFile(p, JSON.stringify(cart), err => {
        if(err) console.log(err)
      });
    });
  }

  static removeItem(id, price) {
    getCartFromFile(cart => {
      if(!cart.products.length) return;
      const product = cart.products.find(p => p.id === id);
      if(product.qty === 1) {
        cart.products = cart.products.filter(p => p.id !== id);
      } else {
        product.qty--;
      }
      cart.total -= price;
      fs.writeFile(p, JSON.stringify(cart), err => {
        if(err) console.log(err)
      });
    });
  }

  static deleteProduct(id, price) {
    getCartFromFile(cart => {
      if(!cart.products.length) return;
      const qty = cart.products.find(p => p.id === id).qty || 0;
      if(!qty) return;
      cart.products = cart.products.filter(p => p.id !== id);
      cart.total -= price * qty;
      fs.writeFile(p, JSON.stringify(cart), err => {
        if(err) console.log(err)
      });
    });
  }

  static getCart(cb) {
    getCartFromFile(cart => {
      cb(cart);
    });
  }
};