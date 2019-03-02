const Sequelize = require('sequelize'),
  sequelize = require('../util/db'),
  OrderItem = sequelize.define('orderItem', {
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

module.exports = OrderItem;