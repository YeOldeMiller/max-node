const mongoose = require('mongoose'),
  { Schema, model } = mongoose;

const productSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  });

module.exports = model('Product', productSchema);