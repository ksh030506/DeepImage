var express = require('express');
var router = express.Router();
    
router.get('/',function(req,res){
    res.render('index', {pass: true});
});
router.get('/packages',function(req,res){
    res.render('packages')
});
router.get('/help',function(req,res){
    res.render('help')
});
router.get('/contact', function(req, res){
    res.render('contact');
});
router.get('/register', function(req, res){
    res.render('register', {pass: false});
});
router.get('/login', function(req, res){
    res.render('login');
});
router.get('/blog', function(req, res){
    res.render('blog');
})
router.get('/blog_details', function(req, res){
    res.render('blog_details');
});
router.get('/elements', function(req, res){
    res.render('elements');
});

module.exports = router;
