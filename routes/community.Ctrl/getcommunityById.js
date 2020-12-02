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

const getcommunityById = function(req, res){
    let commid = req.params.id;
    // 만약 사용자가 맞지 않다면 수정할 수 없는 텍스트를 보여주고 사용자가 맞으면 수정 가능한 텍스트를 보여준다.
    let UserSession = req.session.userEmail;
    connection.query(`SELECT commid, userEmail, title, content, DATE_FORMAT(comm_time, '%Y-%m-%d %H:%i:%s') AS comm_time, Img FROM community where commid = ?`, [commid], function(err, rows, fields){
        if(err){
            console.log(err);
        } else {
            res.render('communityOne', {rows: rows, user:req.session.userEmail});
        }
    });
};

module.exports = getcommunityById;