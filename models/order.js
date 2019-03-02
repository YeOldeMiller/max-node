const Sequelize = require('sequelize'),
  sequelize = require('../util/db'),
  Order = sequelize.define('order', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    }
  });

module.exports = Order;