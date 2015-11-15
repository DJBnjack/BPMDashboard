var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var rp = require('request-promise');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Disable cache
app.disable('etag');

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

// // get node info
// var node_info = "";
// var authorizationHeader = {	'Authorization': 'ApiKey djbnjack:97c5dae24f965291a3433efa99684113d2fee38f'};
// var baseTutumURI = "https://dashboard.tutum.co/";  
// var getNodes = {
// 	uri: baseTutumURI + "/api/v1/node/18179ace-908d-43eb-9112-afd3b532788a/",
// 	headers: authorizationHeader,
// 	json: true,
// };
// 
// var updateNodeInfo = function(cb){
//   rp(getNodes)
//     .then(function (result){
//       node_info = JSON.stringify(result, null, 2)
//       console.log(node_info);
//       if (typeof cb === 'function') cb();
//     })
//     .catch(function (error){
//       console.error(error);
//     })
// } 
// 
// setInterval(updateNodeInfo, 60*1000);
// app.get('/', function(req, res) {
//   if (node_info.length === 0) updateNodeInfo(function () {
//     res.render('index', {node_info: node_info});
//   });
// });


app.get('/', function(req, res) {
    res.render('index', {
      env_info: JSON.stringify(process.env, null, 2),
      datetime: new Date().toISOString()
    });
})

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
