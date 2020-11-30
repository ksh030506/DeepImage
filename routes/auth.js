var express = require('express');
var app = express();
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var dbconfig = require('../config/dbconfig');
var dbOptions = dbconfig;

app.set('view engine', 'ejs');
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
app.get('/login', loginpage);
app.get('/logout', logout);
app.get('/register', registerpage);
app.get('/mypage', mypage);
app.post('/email', email_send);
app.post('/login', login);
app.post('/sing', sing);


module.exports = app;