const { ObjectId } = require('mongodb'),
  { getDb } = require('../util/db');

class Product {
  constructor({ name, price, description, imageUrl, _id }, userId) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    if(_id) this._id = new ObjectId(_id);
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if(this._id) {
      dbOp = db.collection('products').updateOne(
        { _id: this._id },
        { $set: this }
      );
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp.catch(console.log)
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray()
      .catch(console.log);
  }

  static findById(id) {
    const db = getDb();
    return db.collection('products').findOne({ _id: new ObjectId(id) })
      .catch(console.log);
  }

  static deleteById(id) {
    const db = getDb();
    return db.collection('products').deleteOne({ _id: new ObjectId(id) })
      .catch(console.log);
  }
}

module.exports = Product;