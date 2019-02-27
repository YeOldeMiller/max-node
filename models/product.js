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
  constructor(name) {
    this.name = name;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => console.log(err));
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
}