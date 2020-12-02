require('dotenv').config();
var express = require('express');
var app = express();
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var dbconfig = require('../config/dbconfig');
var dbOptions = dbconfig;
var connection = mysql.createConnection(dbOptions);
connection.query('USE ' + dbconfig.database);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: process.env.sessiohn_secret_key,
    store: new MySQLStore(dbOptions),
    resave: false,
    saveUninitialized: false
}));

const indexpage = require('./auth.Ctrl/indexpage');
const loginpage = require('./auth.Ctrl/loginpage');
const registerpage = require('./auth.Ctrl/registerpage');
const logout = require('./auth.Ctrl/logout');
const mypage = require('./auth.Ctrl/mypage');
const email_send = require('./auth.Ctrl/email');
const login = require('./auth.Ctrl/login');
const sing = require('./auth.Ctrl/sing');

app.get('/', indexpage);
app.get('/loginpage', loginpage);
app.get('/logout', logout);
app.get('/register', registerpage);
app.get('/mypage', mypage);
app.post('/email', email_send);
app.post('/login', login);
app.post('/sing', sing);

module.exports = app;