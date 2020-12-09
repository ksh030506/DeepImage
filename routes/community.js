require('dotenv').config();
const express = require('express');
const app = express();
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');

const dbconfig = require('../config/dbconfig');
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

const upload = require('../Middleware/file_load');
const blog_detailspage = require('./community.Ctrl/blog_detailspage');
const community = require('./community.Ctrl/communitypage');
const getcommunity = require('./community.Ctrl/getcommunity');
const createcommunitypage = require('./community.Ctrl/createcommunitypage');
const createcommunity = require('./community.Ctrl/createcommunity');
const deletecommunity = require('./community.Ctrl/deletecommunity');
const updatecommunity = require('./community.Ctrl/updatecommunity');
const getcommunityById = require('./community.Ctrl/getcommunityById');
const communitysearch = require('./community.Ctrl/communitysearch');
const searchname = require('./community.Ctrl/searchname');

app.get('/community', community);
app.get('/blog_details', blog_detailspage);
app.get('/getcomm', getcommunity);
app.get('/create', createcommunitypage);
app.post('/createComm', upload.single('filename'), createcommunity);
app.post('/deletecomm', deletecommunity);
app.post('/commupdate', updatecommunity);
app.get('/getcomm/:id', getcommunityById);
app.post('/search', communitysearch);
app.post('/searchname', searchname);

module.exports = app;