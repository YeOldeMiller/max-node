const path = require('path');

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

const adminRoutes = require('./routes/admin'),
  shopRoutes = require('./routes/shop'),
  errorController = require('./controllers/error');

const User = require('./models/user');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5c7b6bb49bfac937dcacff37').then(user => {
    req.user = user;
    next();
  })
  .catch(console.log);
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


mongoose.connect('mongodb+srv://max-node-app:mXxCRasakB426nfP@cluster0-yqoow.mongodb.net/shop?retryWrites=true',
  {
    useNewUrlParser: true,
    useFindAndModify: false
  })
    .then(() => app.listen(3000))
    .catch(console.log);

