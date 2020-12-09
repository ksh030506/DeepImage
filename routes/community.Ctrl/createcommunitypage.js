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

const createcommunitypage = function(req, res){
    if(!req.session.userEmail){
        res.redirect('/login');
    }
    else{
        connection.query('select email_auth from user where userEmail = ?', [req.session.userEmail], function(err, rows, fields){
            if(err) console.log(err);

            let email_auth = rows[0].email_auth;
            if(email_auth == 0){
                res.send('<script type="text/javascript">alert("이메일 인증을 해주세요"); window.location="/mypage"; </script>');
            } else {
                res.render('createcommunity', {user: req.session.userEmail});
            }     
        });
    }
};

module.exports = createcommunitypage;