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

const sing = function(req, res){
    var data = req.body;
    let password1 = data.password;
    var password2 = data.Cpassword;
    var param = [data.email, data.name, data.password];


    if(data.name && data.email && password1 && password2){
        connection.query(`select userEmail from user where userEmail = ?`, [data.email], function(err, rows, fields){
            if(err) console.log(err);
            if(!rows[0]) {
                if(password1 == password2) {
                    connection.query('insert into user(userEmail, userName, password) values(?, ?, ?)', param, function(err, rows, fields){
                        if(!err){
                            res.json({
                                "user": data.email,
                                "msg": "회원가입성공"
                            });
                        } else {
                            res.json({
                                "msg": "회원가입실패"
                            });
                        }
                    });
                }
                else {
                    res.json({
                        "msg": "비밀번호확인틀림"
                    });
                }
            } else {
                res.json({
                    "msg": "이메일중복"
                });
            }
        });
    } else {
        res.json({
            "msg": "값빔"
        });
    }
    
};

module.exports = sing;