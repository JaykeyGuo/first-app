require('./models/init');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var useragent = require('express-useragent');
var createError = require('http-errors');
var connectMongodb = require('connect-mongo');
var session = require('express-session');

var config = require('./config');
var auth = require('./middlewares/auth');
var page = require('./route.page');
var api = require('./route.api');

var MongoStore = new connectMongodb(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.cookieName));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: config.sessionSecret,
    store: new MongoStore({
      url: config.mongodbUrl
    }),
    resave: true,
    saveUninitialized: true
  })
);

app.use(auth.authUser);

app.use('/', page);
app.use('/api/v1', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.format({
    json() {
      res.send({ error: err.toString() });
    }, 

    html() {
      res.render('error');
    },

    default() {
      const message = '${errorDetails}';
      res.send('500 Internal server error: \n${err.toString()}');
    },
  });
});

module.exports = app;