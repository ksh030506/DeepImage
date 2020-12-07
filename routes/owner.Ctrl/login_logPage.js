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

const loginLog_Page = function(req, res){
    connection.query(`SELECT UserEmail, DATE_FORMAT(login_date, '%Y-%m-%d %H:%i:%s') AS login_date FROM Net.login_log`, function(err, rows, fields){
        if(err) console.log(err);

        res.render('loginLog', {user:req.session.userEmail, rows: rows});
    });
    
};

module.exports = loginLog_Page;