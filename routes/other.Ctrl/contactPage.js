require('dotenv').config();
var express = require('express');
var app = express();
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var dbconfig = require('../../config/dbconfig');
var dbOptions = dbconfig;

var connection = mysql.createConnection(dbOptions);
connection.query('USE ' + dbconfig.database);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(session({
    secret: process.env.sessiohn_secret_key,
    store: new MySQLStore(dbOptions),
    resave: false,
    saveUninitialized: false
}));

const contactPage = function(req, res){
    res.render('contact', {user:req.session.userEmail});
};

module.exports = contactPage;