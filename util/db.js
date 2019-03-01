const Sequelize = require('sequelize'),
  sequelize = new Sequelize('max-node', 'root', '1492', { dialect: 'mysql', host: 'localhost' });

module.exports = sequelize;