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

const login = async function(req, res){
    var data = req.body;
    var RUserEmail = data.email;
    var RUserPassword = data.password;
    var rememberId = data.rememberId;

    if(RUserEmail && RUserPassword) {
        connection.query(`select * from user where userEmail = ?`, RUserEmail, function(err, rows, fields){
            if(err){
                console.log(err);
            }
            if(!rows[0]){
                res.json({
                    "msg": '아이디틀림'
                });
            }
            else {
                var DUserEmail = rows[0]['userEmail'];
                var DuserPassword = rows[0]['password'];
    
                if(DuserPassword == RUserPassword){
                    console.log("로그인 성공");
                    
                    if(rememberId === "checked"){
                        console.log("아이디 저장 체크!");
                        res.cookie('loginId', RUserEmail);
                    }
                    req.session.userEmail = DUserEmail;
                    req.session.save(function(){
                        res.json({
                            "msg": 'success',
                            "user": req.session.userEmail
                        });
                    });
                }
                else {
                    res.json({
                        "msg": '비밀번호틀림'
                    });
                }
            }
        });
    } else {
        res.json({
            "msg": '값이빔'
        });
    }
        
};

module.exports = login;