var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var processes = require('./api/processes.js');
var session = require('express-session')({
        secret: "aliensAreAmongUs",
        resave: true,
        saveUninitialized: true
    });
var sharedsession = require('express-socket.io-session');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

// Disable cache
app.disable('etag');

// Setup server
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();

// Setup process api
processes.setupProcessApi(router);

// Set router
app.use('/', router);

// Test Socket.IO
io.use(sharedsession(session));
io.on('connection', function(socket){
	console.log("connected");
	socket.emit("greetings", {msg:"hello"});
	socket.on("something", function(data){
		console.log("client sent data: " + data);
		console.log(socket.handshake.session);
	})
});
