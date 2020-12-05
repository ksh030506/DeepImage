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
        connection.query(`select user.userName, user.userEmail, user.register_data, user_info.nickname, user_info.phoneNumber, user_info.adress, user_info.gender from user, user_info where user.userEmail = user_info.userEmail and user.userEmail = ?`,
        [Session], function(err, rows, fields){
            if(err) console.log(err);
            let userEmail = rows[0].userEmail;
            let register_date = rows[0].register_data;
            let userName = rows[0].userName;
            let nickname = rows[0].nickname;
            let phoneNumber = rows[0].phoneNumber;
            let adress = rows[0].adress;
            let gender = rows[0].gender;
            let email_auth = rows[0].email_auth;
            res.render('mypage', {
                user:req.session.userEmail,
                userEmail : userEmail,
                userName : userName,
                pass:email_auth,
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