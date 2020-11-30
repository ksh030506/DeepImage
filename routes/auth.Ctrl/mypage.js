require('dotenv').config();
var express = require('express');
var app = express();
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var dbconfig = require('../../config/dbconfig');
var dbOptions = dbconfig;

app.use(session({
    secret: process.env.sessiohn_secret_key,
    store: new MySQLStore(dbOptions),
    resave: false,
    saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.set('views', './views');

var connection = mysql.createConnection(dbOptions);
connection.query('USE ' + dbconfig.database);

const mypage = function(req, res){
    let Session = req.session.userEmail;
    if(!Session){
        res.redirect('/login');
    }else {
        connection.query(`select * from user where userEmail = ?`, [Session], function(err, rows, fields){
            if(err) console.log(err);
            let userEmail = rows[0].userEmail;
            let userName = rows[0].userName;
            let email_auth = rows[0].email_auth;
            res.render('mypage', {user:req.session.userEmail, userEmail : userEmail, userName : userName, pass:email_auth});
        });
    }
};

module.exports = mypage;