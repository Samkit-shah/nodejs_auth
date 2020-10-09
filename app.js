/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    index = require('./routes/index'),
    http = require('http'),
    path = require('path');
//var methodOverride = require('method-override');
var session = require('express-session');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodeauthlogin'
});

connection.connect();

global.db = connection;

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

// development only

app.get('/', index.homepage); //call for main index page
app.get('/register', user.register); //call for signup page
app.post('/register', user.register); //call for signup post
app.get('/login', index.login_final); //call for login page
app.post('/login', user.login); //call for login post
app.post('/donation', user.donation); //call for login post

app.get('/home/logout', user.logout); //call for logout
app.get('/home/profile', user.profile); //to render users profile
//Middleware
app.listen(8082)