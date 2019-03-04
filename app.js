require('dotenv').config()
const path = require('path');

const express = require('express'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  mongoose = require('mongoose'),
  MongoDBStore = require('connect-mongodb-session')(session),
  csrf = require('csurf'),
  flash = require('connect-flash');

const app = express(),
  store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
  }),
  csrfProtection = csrf();
  

const adminRoutes = require('./routes/admin'),
  shopRoutes = require('./routes/shop'),
  authRoutes = require('./routes/auth'),
  errorController = require('./controllers/error'),
  User = require('./models/user');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
}),
  fileFilter = (req, file, cb) => {
    if(['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
      cb(null, true);
    }
    cb(null, false);
  }

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
  secret: 'Do androids dream of electric sheep?',
  resave: false,
  saveUninitialized: false,
  store
}));

app.use(csrfProtection);
app.use(flash());


app.use((req, res, next) => {
  res.locals.auth = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.errorMsg = req.flash('error');
  next();
});

app.use((req, res, next) => {
  if(!req.session.user) return next();
  User.findById(req.session.user._id)
    .then(user => {
      if(!user) return next();
      req.user = user;
      next()
    })
    .catch(next);
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorController.get500);
app.use(errorController.get404);
app.use((error, req, res, next) => {
  res.redirect('/500');
});


mongoose.connect(process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useFindAndModify: false
  })
    .then(app.listen(3000))
    .catch(console.log);

