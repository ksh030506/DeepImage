require('dotenv').config();
const express = require('express');
const app = express();
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const dbconfig = require('../../config/dbconfig');
const dbOptions = dbconfig;

const connection = mysql.createConnection(dbOptions);
connection.query('USE ' + dbconfig.database);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: process.env.sessiohn_secret_key,
    store: new MySQLStore(dbOptions),
    resave: false,
    saveUninitialized: false
}));

const updatecommunity = function(req, res){
    let data = req.body;
    let commid = data.commid;
    let UserSession = req.session.userEmail;
    let writer = data.writer;
    let title = data.title;
    let content = data.content;
    
    if(UserSession != writer){
        res.json({
            "msg": "수정권한없음"
        });
    }
    else {
        connection.query(`update community set title = ?, content = ? where commid = ?`, [title, content, commid], function(err, rows, fields){
            if(err){
                console.log(err);
            } else {
                res.send('<script type="text/javascript">alert("수정 성공"); window.location="/getcomm"; </script>');
            }
        });
    }
};

module.exports = updatecommunity;