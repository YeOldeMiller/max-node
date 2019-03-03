const mongoose = require('mongoose'),
  { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    cart: {
      items: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
      }]
    }
  });

userSchema.methods.addToCart = function(product) {
    item = this.cart.items.find(item => item.product.toString() === product._id.toString());
  if(item) {
    item.quantity++;
  } else {
    this.cart.items.push({
      product: product._id,
      quantity: 1
    });
  }
  return this.save();
}

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
}

userSchema.methods.removeFromCart = function(productId) {
  this.cart.items = this.cart.items.filter(item => (
    item.product.toString() !== productId.toString()
  ));
  return this.save();
}

module.exports = model('User', userSchema);

// const { ObjectId } = require('mongodb'),
//   { getDb } = require('../util/db');

// class User {
//   constructor({ username, email, _id }, cart) {
//     this.username = username;
//     this.email = email;
//     if(_id) this._id = _id;
//     if(cart) this.cart = cart;
//   }

//   save() {
//     const db = getDb();
//     return db.collection('users').insertOne(this)
//       .catch(console.log);
//   }

//   getCart() {
//     const db = getDb();
//     const productIdList = this.cart.items.map(item => new ObjectId(item.productId))
//     return db.collection('products').find({ _id: { $in: productIdList } })
//       .toArray()
//       .then(products => products.map(p => (
//         {
//           ...p,
//           qty: this.cart.items.find(i => (
//             i.productId.toString() === p._id.toString()
//           )).quantity
//         }
//       )))
//       .catch(console.log);
//   }

//   addToCart(product) {
//     const db = getDb();
//     const cartProductIndex = this.cart.items.findIndex(p => (
//       p.productId.toString() === product._id.toString()
//     ));
//     let newQty = 1;
//     const updatedCartItems = [ ...this.cart.items ];

//     if(cartProductIndex >= 0) {
//       newQty += this.cart.items[cartProductIndex].quantity;
//       updatedCartItems[cartProductIndex].quantity = newQty;
//     } else {
//       updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQty })
//     }
//     return db.collection('users').updateOne(
//       { _id: ObjectId(this._id) },
//       { $set: { cart: { items: updatedCartItems } } }
//     )
//     .catch(console.log);
//   }

//   removeFromCart(id) {
//     const db = getDb();
//     const updatedCartItems = this.cart.items.filter(item => (
//       item.productId.toString() !== id.toString()
//     ));
//     return db.collection('users').updateOne(
//       { _id: ObjectId(this._id) },
//       { $set: { cart: { items: updatedCartItems } } }
//     )
//     .catch(console.log);
//   }

//   getOrders() {
//     const db = getDb();
//     return db.collection('orders').find({ 'user._id': new ObjectId(this._id) }).toArray()
//       .catch(console.log);
//   }

//   async addOrder () {
//     try {
//       const db = getDb();
//       const products = await this.getCart(),
//         order = {
//         items: products,
//         user: {
//           _id: new ObjectId(this._id),
//           username: this.username,
//         }
//       }
//       await db.collection('orders').insertOne(order);
//       this.cart = { items: [] };
//       return db.collection('users').updateOne(
//         { _id: ObjectId(this._id) },
//         { $set: { cart: this.cart } }
//       );
//     } catch(err) {
//       console.log(err);
//     }
//   }

//   static findById(id) {
//     const db = getDb();
//     return db.collection('users').findOne({ _id: new ObjectId(id) })
//       .catch(console.log);
//   }
// }

// module.exports = User;