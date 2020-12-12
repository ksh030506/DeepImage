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
        connection.query(`SELECT user.userEmail, DATE_FORMAT(user.register_data, '%Y-%m-%d %H:%i:%s') AS comm_time, user.userName, user.nickname, user.phone, user.address, user.gender, user.email_auth, SUM(user_point.point) as pointsum from user, user_point where user.userEmail = user_point.userEmail and user.userEmail = ? group by userEmail`,
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
            let pointsum = rows[0].pointsum;

            console.log(userEmail, register_date, userName, nickname, phoneNumber, adress, gender, email_auth, pointsum);

            connection.query(`select level from lank  where lankcol between (select SUM(point) from user_point where userEmail = ?) and (select SUM(point) from user_point where userEmail = ?)`, [req.session.userEmail, req.session.userEmail], function(err, rows2, feilds){
                if(err) console.log(err);
                let lank = rows2[0].level;

                res.render('mypage', {
                    user:req.session.userEmail,
                    userEmail : userEmail,
                    userName : userName,
                    pass: email_auth,
                    register_date: register_date,
                    nickname: nickname,
                    phoneNumber: phoneNumber,
                    adress: adress,
                    gender: gender,
                    pointsum: pointsum,
                    lank: lank
                });
            });
        });
    }
};

module.exports = mypage;