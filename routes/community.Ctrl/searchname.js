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


const searchname = function(req, res){
    let data = req.body;
    let searchkeyword = data.search;
    let querykeyword = '%' + searchkeyword + '%';

    connection.query(`select commid, userEmail, title, content, DATE_FORMAT(comm_time, '%Y-%m-%d %H:%i:%s') AS comm_time, Img from community where userEmail = (select userEmail from user where userName like ?) order by commid DESC`
    ,[querykeyword], function(err, rows, fields){
        if(err) console.log(err);
        if(!rows[0]){
            res.send('<script type="text/javascript">alert("데이터가 없습니다"); window.location="/getcomm"; </script>');
        } else {
            res.render('community', {rows:rows, user:req.session.userEmail});
        }
    });
};

module.exports = searchname;