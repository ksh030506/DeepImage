var express = require('express');
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var dbconfig = require('../config/dbconfig');
const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "sanghyeon030506@gmail.com",
        pass: "ksh03050621!"
    },
    tls: {
        rejectUnauthorized: false
    }
  });

var app = express();
var dbOptions = dbconfig;

var connection = mysql.createConnection(dbOptions);
connection.query('USE ' + dbconfig.database);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cookieParser());
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
        var userId = "";
        if(req.cookies['loginId'] !== undefined){
            userId = req.cookies['loginId'];
            res.render('login', {userId: userId});
        }
        else {
            res.render('login', {userId: ""});
        }
        
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

app.get('/mypage', function(req, res){
    let Session = req.session.userEmail;
    if(!Session){
        res.redirect('/login');
    }else {
        connection.query(`select * from user where userEmail = ?`, [Session], function(err, rows, fields){
            if(err) console.log(err);
            let userEmail = rows[0].userEmail;
            let userName = rows[0].userName;
            let email_auth = rows[0].email_auth;
            res.render('mypage', {user:req.session.userEmail, userEmail : userEmail, userName : userName, pass:email_auth});
        });
    }
});

// 숫자
let authNum = Math.random().toString().substr(2,6);

let emailTemplete;
ejs.renderFile('views/emailtemplete.ejs', {authCode : authNum}, function (err, data) {
  if(err) console.log(err);
  emailTemplete = data;
});

app.post('/email', async(req, res) => {
    let Session = req.session.userEmail;
    let data = req.body;
    let auth_code = data.auth_code;

    if(auth_code == authNum){
        connection.query(`update Net.user set email_auth = 1 where userEmail = ?;`, [Session], function(err, rows, fields){
            if(err) console.log(err);
            res.redirect('/mypage');
        });
    } else {
        const mailOptions = {
            from: "sanghyeon030506@gmail.com",
            to: req.session.userEmail,
            subject: "이메일 인증",
            html : emailTemplete
          };
    
          await smtpTransport.sendMail(mailOptions, (error, responses) =>{
            if(error) console.log(error);
            console.log("이메일 보내기 완료");
            res.redirect('/mypage');
            smtpTransport.close();
        });
    }
});



//로그인 API
app.post('/login', function(req, res){
    var data = req.body;
    var RUserEmail = data.email;
    var RUserPassword = data.password;

    connection.query(`select * from user where userEmail = ?`, RUserEmail, function(err, rows, fields){
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
            if(req.body.rememberId === "checked"){
                console.log("아이디 저장 체크!");
                res.cookie('loginId', RUserEmail);
            }
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