const express = require('express');
const app = express();
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: require('crypto').randomBytes(64).toString('base64')
}));

app.set('port', process.env.PORT || 6472);
app.use(logger('dev'));
app.set('views', path.join(__dirname, 'render'));
app.set('view engine', 'pug');

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/dynamic', express.static(path.join(__dirname, 'dynamicAssets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', require('./routes/index.js'));
app.use('/admin', require('./routes/admin.js')(passport));

//handle 404
app.use((req, res, next) => {
  const err = new Error('Not Found on ' + req.originalUrl);
  err.status = 404;
  err.isNotFound = true;
  next(err);
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error', {err: err});
});

app.listen(app.get('port'), () => {
  console.log('Listening on port: ', app.get('port'))
})
