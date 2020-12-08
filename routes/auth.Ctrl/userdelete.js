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

const userdelete = function(req, res){
    let userEmail = req.session.userEmail;

    connection.query(`delete from user where userEmail = ?`, [userEmail], function(err, rows, fields){
        if(err) console.log(err);

        res.clearCookie('loginId');
        req.session.destroy(function(err){
            res.send('<script type="text/javascript">alert("회원 탈퇴 성공"); window.location="/"; </script>');
        });
    });
};

module.exports = userdelete;