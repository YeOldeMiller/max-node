const Sequelize = require('sequelize'),
  sequelize = require('../util/db'),
  Cart = sequelize.define('cart', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    }
  });

module.exports = Cart;