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
                connection.query('insert into community(userEmail, title, content, Img) VALUES(?, ?, ?, ?)', [writer ,title, content, image], function(err, rows, fields){
                    if(err){
                        console.log(err);
                    }
                    else {
                        connection.query(`insert into user_point(userEmail, point) VALUES (?, ?)`, [writer, 1], function(err, rows, fields){
                            if(err) console.log(err);

                            res.redirect('/getcomm');
                        });
                    }
                }); //res.redirect('/mypage');
            } else {
        res.redirect('/create');
    }
};

module.exports = createcommunity;