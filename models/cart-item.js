const Sequelize = require('sequelize'),
  sequelize = require('../util/db'),
  CartItem = sequelize.define('cartItem', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    qty: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

module.exports = CartItem;