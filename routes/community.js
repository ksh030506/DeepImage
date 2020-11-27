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
    let writer = req.session.userEmail || data.userEmail;

    connection.query('insert into community(userEmail, title, content) VALUES(?, ?, ?)', [writer ,title, content], function(err, rows, fields){
        if(err){
            console.log(err);
        }
        else {
            res.render('community');
        }
    });
});

app.delete('/deletecomm/:id', function(req, res){
    let UserSession = req.session.userEmail;
    let commid = req.params.id;

    // connection.query('먼저 UsreSession이 DB에 들어가 있는 User와 일치한지 검사', function(err, rows, fields){
    //     if(err){
    //         console.log(err);
    //     }
    //     else {
            connection.query('delete from community where commid = ?', [commid], function(err, rows, fields){
                if(err){
                    console.log(err);
                }
                else {
                    console.log(rows);
                }
            });
       // }
    });
// });


app.patch('/commupdate/:id', function(req, res){
    let commid = req.params.id;
    let data = req.body;
    let UserSession = req.session.userEmail;
    let title = data.title;
    let content = data.content;

    // connection.query('먼저 UserSession이 DB에 들어가 있는 User와 일치한지 검사', function(err, rows, fields){
    //     if(err){
    //         console.log(err);
    //     }
    //     else {
            connection.query('update community set title = ?, content = ? where commid = ?', [title, content, commid], function(err, rows, fields){
                if(err){
                    console.log(err);
                } else {
                    connection.query('select * from community where commid = ?', [commid], function(err, rows, fields){
                        if(err) console.log(err);
                        else {
                            console.log(rows);
                        }
                    })
                }
            });
        //}
    });
//});

app.get('/getcomm', function(req, res){
    connection.query(`select * from community`, function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            let commid = rows[0].commid;
            let title = rows[0].title;
            let writer = rows[0].userEmail;
            let content = rows[0].content;
            let comm_time = rows[0].comm_time;

            res.render('community', {});
        }
    });
});

app.get('/getcomm/:id', function(req, res){
    let commid = req.params.id;
    // 만약 사용자가 맞지 않다면 수정할 수 없는 텍스트를 보여주고 사용자가 맞으면 수정 가능한 텍스트를 보여준다.
    let UserSession = req.session.userEmail;
    connection.query(`select * from community where commid = ?`, [commid], function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            let commid = rows[0].commid;
            let title = rows[0].title;
            let writer = rows[0].userEmail;
            let content = rows[0].content;
            let comm_time = rows[0].comm_time;

            res.render('communityOne', {});
        }
    });
});



module.exports = app;