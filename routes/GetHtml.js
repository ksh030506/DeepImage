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
app.get('/blog', function(req, res){
    res.render('blog');
})
app.get('/blog_details', function(req, res){
    res.render('blog_details');
});
app.get('/elements', function(req, res){
    res.render('elements');
});
module.exports = app;
