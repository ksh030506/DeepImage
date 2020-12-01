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

const logout = function(req, res){
    req.session.destroy(function(err){
        res.json({
            'msg': '로그아웃완료'
        });
    });
};

module.exports = logout;