var express = require('express');
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var ejs = require('ejs');
var dbconfig = require('../config/dbconfig');
require('dotenv').config();

var app = express();
var dbOptions = dbconfig;

var connection = mysql.createConnection(dbOptions);
connection.query('USE ' + dbconfig.database);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: process.env.sessiohn_secret_key,
    store: new MySQLStore(dbOptions),
    resave: false,
    saveUninitialized: false
}));

app.get('/imageChage',function(req,res){
    res.render('imageChage', {user:req.session.userEmail});
});
app.get('/help',function(req,res){
    res.render('help', {user:req.session.userEmail});
});
app.get('/contact', function(req, res){
    res.render('contact', {user:req.session.userEmail});
});

module.exports = app;