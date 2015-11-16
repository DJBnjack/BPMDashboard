var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var processes = require('./dal/processes.js')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Disable cache
app.disable('etag');

// Setup server
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// setup tests
app.use(function(req, res, next){
 res.locals.showTests = app.get('env') !== 'production' &&  req.query.test === '1';
 next();
});

var router = express.Router();

// Expose process logic
router.get('/processes', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  processes.getProcesses(info => res.send(info));
});

router.get('/processes/:guid', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  processes.getProcess(req.params.guid, info => res.send(info));
});

router.post('/processes', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  processes.createProcess(info => res.send(info));
});

router.delete('/processes', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  processes.deleteProcesses(info => res.send(info));
});

router.delete('/processes/:guid', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  processes.deleteProcess(req.params.guid, info => res.send(info));
});

router.get('/', (req, res) => res.render('index', { datetime: new Date().toLocaleString()}));

app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

module.exports = app;