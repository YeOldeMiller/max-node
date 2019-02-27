const path = require('path');

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin'),
  shopRoutes = require('./routes/shop'),
  errorController = require('./controllers/error');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);