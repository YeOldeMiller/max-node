require('dotenv').config()
const path = require('path');

const express = require('express'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  MongoDBStore = require('connect-mongodb-session')(session),
  csrf = require('csurf'),
  flash = require('connect-flash');

// const MONGODB_URI = 'mongodb+srv://max-node-app:nXLUFaniM5w8sIYT@cluster0-yqoow.mongodb.net/shop?retryWrites=true';

const app = express(),
  store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
  }),
  csrfProtection = csrf();
  

const adminRoutes = require('./routes/admin'),
  shopRoutes = require('./routes/shop'),
  authRoutes = require('./routes/auth'),
  errorController = require('./controllers/error');

const User = require('./models/user');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'Do androids dream of electric sheep?',
  resave: false,
  saveUninitialized: false,
  store
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if(!req.session.user) return next();
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next()
    })
    .catch(console.log);
});

app.use((req, res, next) => {
  res.locals.auth = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.errorMsg = req.flash('error');
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);


mongoose.connect(process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useFindAndModify: false
  })
    .then(() => app.listen(3000))
    .catch(console.log);

