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

app.get('/community', function(req, res){
    if(!req.session.userEmail){
        res.redirect('/login');
    }
    else {
        res.render('community');
    }
});

app.get('/blog_details', function(req, res){
    if(!req.session.userEmail){
        res.redirect('/login');
    }
    else {
        res.render('communityOne');
    }
});

app.get('/글쓰기 페이지', function(req, res){
    if(!req.session.userEmail){
        res.redirect('/login');
    }
    else{
        res.render('글쓰기 페이지', {user: req.session.userEmail});
    }
});

app.post('/createComm', function(req, res){
    let data = req.body;
    let title = data.title;
    let content = data.content;
    let writer = req.session.userEmail;

    connection.query('', function(err, rows, fields){
        if(err){
            console.log(err);
        }
        else {
            console.log("성공");
        }
    });
});

app.delete('/delete/:id', function(req, res){
    let UserSession = req.session.userEmail;
    let commid = req.params.id;

    connection.query('먼저 UsreSession이 DB에 들어가 있는 User와 일치한지 검사', function(err, rows, fields){
        if(err){
            console.log(err);
        }
        else {
            connection.query('해당 게시물 삭제', function(err, rows, fields){
                if(err){
                    console.log(err);
                }
                else {
                    console.log("성공");
                }
            });
        }
    });
});

app.patch('커뮤니티 글 수정/:id', function(req, res){
    let data = req.body;
    let UserSession = req.session.userEmail;
    let title = data.title;
    let content = data.content;
    let commid = req.params.id;

    connection.query('먼저 UserSession이 DB에 들어가 있는 User와 일치한지 검사', function(err, rows, fields){
        if(err){
            console.log(err);
        }
        else {
            connection.query('해당 게시물 수정', function(err, rows, fields){
                if(err){
                    console.log(err);
                } else {
                    console.log("성공");
                }
            });
        }
    });
});

app.get('커뮤니티 글 보기', function(req, res){
    connection.query('게시물 전체 보기 userid DESC와 나중에 페이징 처리', function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            console.log("성공");
        }
    });
});

app.get('해당 글 보기/:id', function(req, res){
    let commid = req.params.id;
    // 만약 사용자가 맞지 않다면 수정할 수 없는 텍스트를 보여주고 사용자가 맞으면 수정 가능한 텍스트를 보여준다.
    let UserSession = req.session.userEmail;
    connection.query('해당 글 보기', function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            console.log("성공");
        }
    });
});

module.exports = app;