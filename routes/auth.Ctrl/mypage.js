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
        connection.query(`SELECT userEmail, DATE_FORMAT(register_data, '%Y-%m-%d %H:%i:%s') AS comm_time, userName, nickname, phone, address, gender, email_auth from user where userEmail = ?`,
        [Session], function(err, rows, fields){
            if(err) console.log(err);
            let userEmail = rows[0].userEmail;
            let register_date = rows[0].comm_time;
            let userName = rows[0].userName;
            let nickname = rows[0].nickname;
            let phoneNumber = rows[0].phone;
            let adress = rows[0].address;
            let gender = rows[0].gender;
            let email_auth = rows[0].email_auth;
            console.log(userEmail, register_date, userName, nickname, phoneNumber, adress, gender, email_auth);
            res.render('mypage', {
                user:req.session.userEmail,
                userEmail : userEmail,
                userName : userName,
                pass: email_auth,
                register_date: register_date,
                nickname: nickname,
                phoneNumber: phoneNumber,
                adress: adress,
                gender: gender
            });
        });
    }
};

module.exports = mypage;