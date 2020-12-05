require('dotenv').config();
var express = require('express');
var app = express();
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var dbconfig = require('../../config/dbconfig');
const { get } = require('../auth');
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

const update_user = function(req, res){
    let userEmail = req.session.userEmail;
    var data = req.body;
    let nickname = data.nickname;
    let phone = data.phone;
    let address = data.address;
    let gender = data.gender;
    let param = [userEmail, nickname, phone, address, gender, userEmail];
        connection.query(`update user_info set userEmail = ?, nickname = ?, phoneNumber = ?, adress = ?, gender = ? where userEmail = ?`, param, function(err, rows, fields){
            if(!err){
                res.redirect('/');
            } else { 
                console.log(err);
            }
    });
};

module.exports = update_user;