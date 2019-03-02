const path = require('path');

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin'),
  shopRoutes = require('./routes/shop'),
  errorController = require('./controllers/error');

const sequelize = require('./util/db'),
  Product = require('./models/product'),
  User = require('./models/user'),
  Cart = require('./models/cart'),
  CartItem = require('./models/cart-item'),
  Order = require('./models/order'),
  OrderItem = require('./models/order-item');

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
Cart.belongsTo(User);
User.hasOne(Cart);
CartItem.belongsTo(Cart, { constraints: true, onDelete: 'CASCADE' });
Cart.hasMany(CartItem);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1).then(user => {
    req.user = user;
    next();
  }).catch(console.log);
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize.sync({ force: false })
  .then(() => User.findByPk(1))
  .then(user => {
    if(user) return user;
    return User.create({ name: 'Mordecai', email: 'mordecai@gmail.com' });
  })
  .then(user => user.createCart())
  .then(app.listen(3000))
  .catch(console.log);

