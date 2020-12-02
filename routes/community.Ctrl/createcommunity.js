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

const createcommunity = function(req, res){
    let data = req.body;
    let title = data.title;
    let content = data.content;
    let writer = req.session.userEmail;
    let image;
    if(req.file){
        image = req.file.filename;
    }

    if(title && content && writer){
        connection.query('select email_auth from user where userEmail = ?', [writer], function(err, rows, fields){
            if(err) console.log(err);
            let email_auth = rows[0].email_auth;
            if(email_auth == 1){
                connection.query('insert into community(userEmail, title, content, Img) VALUES(?, ?, ?, ?)', [writer ,title, content, image], function(err, rows, fields){
                    if(err){
                        console.log(err);
                    }
                    else {
                        res.redirect('/getcomm');
                    }
                });
            }
            else {
                res.redirect('/mypage');
            }
        });
    } else {
        console.log("값이 비어있습니다.");
        res.redirect('/getcomm');
    }
};

module.exports = createcommunity;