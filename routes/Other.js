var express = require('express');
var app = express();

app.get('/packages',function(req,res){
    res.render('packages')
});
app.get('/help',function(req,res){
    res.render('help')
});
app.get('/contact', function(req, res){
    res.render('contact');
});

module.exports = app;