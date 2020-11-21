var express = require('express');
var app = express();
    



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
