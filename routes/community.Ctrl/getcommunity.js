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

const getcommunity = function(req, res){
    connection.query(`SELECT commid, userEmail, title, content, DATE_FORMAT(comm_time, '%Y-%m-%d %H:%i:%s') AS comm_time, Img FROM Net.community order by commid DESC`, function(err, rows, fields){
        if(err) console.log(err);
        res.render('community', {title: ' 게시판 리스트', rows: rows, user:req.session.userEmail});
    });
};

module.exports = getcommunity;