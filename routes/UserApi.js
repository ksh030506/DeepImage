var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('../config/dbconfig');
var connection = mysql.createConnection(dbconfig);
connection.query('USE ' + dbconfig.database);

var bodyParser = require('body-parser');

router.get('/test', function(req, res) {
    connection.query('SELECT * from Aca', function(err, rows, fields){
        if(!err){
            console.log(rows, fields);
            res.json({
                "rows": rows,
                "fields": fields 
            });
        } else {
            console.log(err);
        }
    });
});


module.exports = router;