var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
var multer = require('multer');
var flash = require('connect-flash');

var port = 3000;

var routes = require('./routes/index');

var app = express();
console.log('Express initialized!');
app.locals.moment = require('moment');

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
console.log('Jade initilaized!');

// multer destination setup
// app.use(multer({ dest:'./public/images/uploads' })); -> wrong
// var upload = multer({dest: './uploads/'}); -> right

// uncomment after placing favicon in /public
// app.user(favicon(__name + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// handle express session
app.use(session({
	secret: 'what\'s the puzzle',
	saveUninitialized: true,
	resave: true
}));

app.use(express.static(__dirname + '/public'));

// validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;
		while(namespace.length) {
			forParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

app.use(flash());
app.use(function(req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

// make our db accessible to our router
app.use(function(req, res, next) {
	req.db = db;
	next();
});

app.get('*', function(req, res, next) {
	res.locals.user = req.user || null;
	next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not found.');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler, will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		req.flash('error', err);
		res.render('error');
	});
}

app.listen(port);
console.log('Connected to port ' + port + '...');
