require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const dbconfig = require('../../config/dbconfig');
const dbOptions = dbconfig;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: process.env.sessiohn_secret_key,
    store: new MySQLStore(dbOptions),
    resave: false,
    saveUninitialized: false
}));

const blog_detailspage = function(req, res){
    if(!req.session.userEmail){
        res.redirect('/login');
    }
    else {
        res.render('communityOne');
    }
};

module.exports = blog_detailspage;