const path = require('path');

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser');

const adminData = require('./routes/admin'),
  shopRoutes = require('./routes/shop');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res) => {
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  res.render('404', { pageTitle: 'Page Not Found', path: req.url });
});

app.listen(3000);