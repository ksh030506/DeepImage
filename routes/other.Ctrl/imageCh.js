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


const imagech = function(req, res){
    let data = req.body;
    let imgae_chk = data.imgae_chk;
    let writer = data.userEmail;
    let image;
    if(req.file){
        image = req.file.filename;
    }

    console.log(imgae_chk, writer);

    // if(title && content && writer){
    //     connection.query('insert into community(userEmail, title, content, Img) VALUES(?, ?, ?, ?)', [writer ,title, content, image], function(err, rows, fields){
    //         if(err){
    //             console.log(err);
    //         }
    //         else {
    //             res.redirect('/getcomm');
    //         }
    //     }); //res.redirect('/mypage');
    // } else {
    res.redirect('/');
// }

};

module.exports = imagech;