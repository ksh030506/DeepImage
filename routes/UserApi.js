var express = require('express');
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var ejs = require('ejs');
var dbconfig = require('../config/dbconfig');

var app = express();
var dbOptions = dbconfig;

var connection = mysql.createConnection(dbOptions);
connection.query('USE ' + dbconfig.database);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: '!@#$ﬁ^&',
    store: new MySQLStore(dbOptions),
    resave: false,
    saveUninitialized: false
}));

app.get('/',function(req,res){
    if(!req.session.userEmail){
        res.render('index', {user: req.session.userEmail});
    }
    else {
        res.render('index', {user: req.session.userEmail});
    }
});

app.get('/login', function(req, res){
    if(!req.session.userEmail){
        res.render('login', {message: 'input yout id and password'});
    }
    else {
        res.redirect('/');
    }
});

app.get('/logout', function(req, res){
    req.session.destroy(function(err){
        res.redirect('/');
    });
});

app.get('/register', function(req, res){
    if(!req.session.userEmail){
        res.render('register');
    }
    else {
        res.redirect('/');
    }
});

//로그인 API
app.post('/login', function(req, res){
    var data = req.body;
    var RUserEmail = data.email;
    var RUserPassword = data.password;

    connection.query(`dselect * from user where userEmail = ?`, RUserEmail, function(err, rows, fields){
        if(err){
            console.log(err);
        }
        if(!rows[0]){
            return res.render('login', {message: 'please check your id'});
        }

        var DUserEmail = rows[0]['userEmail'];
        var DuserPassword = rows[0]['password'];

        if(DuserPassword == RUserPassword){
            console.log("로그인 성공");
            req.session.userEmail = DUserEmail;
            req.session.save(function(){
                return res.redirect('/');
            });
        }
        else {
            console.log("로그인 실패");
        }
    });
});

//회원가입 API
app.post('/sing', function(req, res){
    var data = req.body;
    var param = [data.email, data.name, data.password];

    connection.query('insert into user values(?, ?, ?)', param, function(err, rows, fields){
        if(!err){
            console.log("회원가입 성공");
            res.redirect('/');
        } else {
            res.render('register');
        }
    });
});


module.exports = app;