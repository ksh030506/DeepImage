require('dotenv').config();
var express = require('express');
var app = express();
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

const login = function(req, res){
    if(!req.session.userEmail){
        var userId = "";
        if(req.cookies['loginId'] !== undefined){
            userId = req.cookies['loginId'];
            res.render('login', {userId: userId});
        }
        else {
            res.render('login', {userId: ""});
        }
        
    }
    else {
        res.redirect('/');
    }
};

module.exports = login;