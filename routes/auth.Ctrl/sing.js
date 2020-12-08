require('dotenv').config();
var express = require('express');
var app = express();
var mysql = require('mysql');
var session = require('express-session');
var crypto = require('crypto');
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

const sing = function(req, res) {
    var data = req.body;
    let password1 = data.password;
    const key = crypto.pbkdf2Sync(password1, 'salt', 100000, 64, 'sha512').toString('hex');
    var param = [data.email, data.name, key];

    if(data.name && data.email && password1){
        connection.query(`select userEmail from user where userEmail = ?`, data.email, function(err, rows, fields){
                if(rows.length == 0){
                        connection.query(`insert into user(userEmail, userName, password) values(?, ?, ?)`, param, function(err, rows, fields){
                            if(err){
                                res.send('<script type="text/javascript">alert("회원가입 실패"); window.location="/register"; </script>');
                            } else {
                                res.json({
                                    "user": data.email,
                                    "msg": "회원가입성공"
                                });
                            }
                        });
                } else {
                    res.send('<script type="text/javascript">alert("이메일 중복"); window.location="/register"; </script>');
                }
        });
    } else {
        res.send('<script type="text/javascript">alert("값을 다 입력해주세요"); window.location="/register"; </script>');
    }
    
};

module.exports = sing;

