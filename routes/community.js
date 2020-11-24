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

app.get('/blog', function(req, res){
    if(!req.session.userEmail){
        res.redirect('/login');
    }
    else {
        res.render('blog');
    }
});
app.get('/blog_details', function(req, res){
    if(!req.session.userEmail){
        res.redirect('/login');
    }
    else {
        res.render('blog_details');
    }
});
app.get('/elements', function(req, res){
    if(!req.session.userEmail){
        res.redirect('/login');
    }
    else {
        res.render('elements');
    }
});


app.post('/commin', function(req, res){

    let UserSession = req.session.userEmail;

    if(!UserSession){
        console.log("세션이 없음");
    } else {
        console.log("세션이 존재 함 : " + UserSession);
    }
});

app.delete('/delete/:id', function(req, res){
    let UserSession = req.session.userEmail;
    let commid = req.params.id;

    connection.query('이메일 검색 세션에 맞는 ');
    
});

app.patch('커뮤니티 글 수정', function(req, res){

});

app.get('커뮤니티 글 보기', function(req, res){

});



module.exports = app;
