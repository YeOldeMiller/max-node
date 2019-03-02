const path = require('path');

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin'),
  shopRoutes = require('./routes/shop'),
  errorController = require('./controllers/error');

const { mongoConnect } = require('./util/db'),
  User = require('./models/user');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5c7ac000520a350880f9b23b').then(user => {
    req.user = new User(user, user.cart);
    next();
  })
  .catch(console.log);
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


mongoConnect(() => app.listen(3000));

