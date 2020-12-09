require('dotenv').config();
var express = require('express');
var app = express();
var ejs = require('ejs');
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const nodemailer = require('nodemailer');
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

//보내는 사람 생성
const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.email_auth,
        pass: process.env.email_auth_pass
    },
    tls: {
        rejectUnauthorized: false
    }
});

//랜덤 인증 숫자 생성
let authNum = Math.random().toString().substr(2,6);

//이메일 템플릿 읽기
let emailTemplete;
ejs.renderFile('views/emailtemplete.ejs', {authCode : authNum}, function (err, data) {
  if(err) console.log(err);
  emailTemplete = data;
});

const email_send = async (req, res) => {
    let Session = req.session.userEmail;
    let data = req.body;
    let auth_code = data.auth_code;

    // if(auth_code){
        if(auth_code == authNum){
            connection.query(`update Net.user set email_auth = 1 where userEmail = ?;`, [Session], function(err, rows, fields){
                if(err) console.log(err);
                res.redirect('/mypage');
                // res.json({
                //     "msg": "이메일인증성공"
                // });
            });
            
        } else {
            const mailOptions = {
                from: process.env.email_auth,
                to: req.session.userEmail,
                subject: "이메일 인증",
                html : emailTemplete
              };
        
              await smtpTransport.sendMail(mailOptions, (error, responses) =>{
                if(error) console.log(error);
                console.log("이메일 보내기 완료");
                res.redirect('/mypage');
                // res.render('mypage', {user:req.session.userEmail, userEmail : userEmail, userName : userName, pass:email_auth, email_send: true});
                smtpTransport.close();
            });
        }
    // } else {
    //     res.redirect('/mypage');
    // }
    
};

module.exports = email_send;