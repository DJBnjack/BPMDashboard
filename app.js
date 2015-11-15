var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var btoa = function (str) {return new Buffer(str).toString('base64');};
var baseNeoURI = 'http://neo4j.databases.djbnjack.svc.tutum.io:8080';
var authorizationHeader = {	'Authorization': 'Basic ' + btoa("neo4j:vetman2") };  

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


function getProcesses(callback) {
  var options = {
    url: baseNeoURI + '/db/data/transaction/commit',
    headers: authorizationHeader,
    json: true,
    method: 'POST',
    body: { "statements" : [
      {
        "statement": "MATCH (n:node {type:'process'}) RETURN n",
        "resultDataContents":["row"]
      }
    ]}
  };
  
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(JSON.stringify(body.results[0].data, null, 2));
    }
  });
};

app.get('/processes', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  getProcesses(function (info) {
    res.send(info);  
  })
});

app.get('/', function(req, res) {
    res.render('index', {
      datetime: new Date().toLocaleString(),
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
