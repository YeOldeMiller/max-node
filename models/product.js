const fs = require('fs'),
  path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = cb => {
  fs.readFile(p, (err, content) => {
    if(err) return cb([]);
    cb(JSON.parse(content));
  });
}

module.exports = class Product {
  constructor({ id = null, name, imageUrl, description, price }) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = parseFloat(price);
  }

  save() {
    getProductsFromFile(products => {
      if(this.id) {
        const index = products.findIndex(p => p.id === this.id);
        products[index] = this;
      } else {
        this.id = Math.random().toString();
        products.push(this);
      }
      fs.writeFile(p, JSON.stringify(products), err => console.log(err));
    });
  }

  static findByIdAndRemove(id, cb) {
    getProductsFromFile(products => {
      const updatedProducts = products.filter(p => p.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => cb(err));
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      cb(products.find(p => p.id === id));
    });
  }
}