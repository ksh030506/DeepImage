var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('../config/dbconfig');
var connection = mysql.createConnection(dbconfig);
connection.query('USE ' + dbconfig.database);


//로그인 API
router.post('/login', function(req, res){
    var data = req.body;
    var param = [data.email, data.password];

    console.log(param);
    res.redirect('/')
});

//회원가입 API
router.post('/sing', function(req, res){
    var data = req.body;
    var param = [data.name, data.email, data.password];

    connection.query('insert into User values(?, ?, ?)', param, function(err, rows, fields){
        if(!err){
            res.render('index', {pass: true});
        } else {
            res.render('register', {pass: false});
        }
    });
});


module.exports = router;