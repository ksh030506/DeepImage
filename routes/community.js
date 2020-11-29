var express = require('express');
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var ejs = require('ejs');
var dbconfig = require('../config/dbconfig');
const { user } = require('../config/dbconfig');
const e = require('express');
const { truncate } = require('fs');

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
        res.redirect('/getcomm');
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

app.get('/create', function(req, res){
    if(!req.session.userEmail){
        res.redirect('/login');
    }
    else{
        res.render('createcommunity', {user: req.session.userEmail});
    }
});

app.post('/createComm', function(req, res){
    let data = req.body;
    let title = data.title;
    let content = data.content;
    let writer = req.session.userEmail;

    if(title && content && writer){
        connection.query('insert into community(userEmail, title, content) VALUES(?, ?, ?)', [writer ,title, content], function(err, rows, fields){
            if(err){
                console.log(err);
            }
            else {
                res.redirect('/getcomm');
            }
        });
    } else {
        console.log("값이 비어있습니다.");
        res.redirect('/getcomm');
    }
});

app.post('/deletecomm', function(req, res){
    let data = req.body;
    let UserSession = req.session.userEmail;
    let commid = req.body.id;
    let writer = data.writer;
    
    if(UserSession != writer){
        console.log("이메일 틀림");
        res.redirect('/getcomm');
    } else {
        connection.query('delete from community where commid = ?', [commid], function(err, rows, fields){
            if(err){
                console.log(err);
            }
            else {
                res.redirect('/comm');
            }
        });
    }
});



app.post('/commupdate', function(req, res){
    let data = req.body;
    let commid = data.id;
    let UserSession = req.session.userEmail;
    let writer = data.writer;
    let title = data.title;
    let content = data.content;
        if(UserSession != writer){
            console.log("이메일 틀림");
            res.redirect('/getcomm');
        }
        else {
            connection.query('update community set title = ?, content = ? where commid = ?', [title, content, commid], function(err, rows, fields){
                if(err){
                    console.log(err);
                } else {
                    res.redirect('/getcomm');
                }
            });
        }
    });

app.get('/getcomm', function(req, res){
    connection.query(`SELECT commid, userEmail, title, content, DATE_FORMAT(comm_time, '%Y-%m-%d %H:%i:%s') AS comm_time FROM Net.community`, function(err, rows, fields){
        if(err) console.log(err);
        res.render('community', {title: ' 게시판 리스트', rows: rows, user:req.session.userEmail});
    });
});


app.get('/getcomm/:id', function(req, res){
    let commid = req.params.id;
    // 만약 사용자가 맞지 않다면 수정할 수 없는 텍스트를 보여주고 사용자가 맞으면 수정 가능한 텍스트를 보여준다.
    let UserSession = req.session.userEmail;
    connection.query(`SELECT commid, userEmail, title, content, DATE_FORMAT(comm_time, '%Y-%m-%d %H:%i:%s') AS comm_time FROM community where commid = ?`, [commid], function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            res.render('communityOne', {rows: rows, user:req.session.userEmail});
        }
    });
});

app.post('/search', function(req, res){
    let data = req.body;
    let searchkeyword = data.search;
    let querykeyword = '%' + searchkeyword + '%';

    connection.query(`SELECT commid, userEmail, title, content, DATE_FORMAT(comm_time, '%Y-%m-%d %H:%i:%s') AS comm_time FROM community where title like ? or userEmail like ?`, [querykeyword, querykeyword], function(err, rows, fields){
        if(err) console.log(err);
        res.render('community', {rows:rows, user:req.session.userEmail});
    });
});




module.exports = app;