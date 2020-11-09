var express = require('express');
var router = express.Router();
    
router.get('/',function(req,res){
    res.render('index.html')
});
router.get('/packages',function(req,res){
    res.render('packages.html')
});
router.get('/help',function(req,res){
    res.render('help.html')
});
router.get('/contact', function(req, res){
    res.render('contact.html');
});
router.get('/register', function(req, res){
    res.render('register.html');
});
router.get('/login', function(req, res){
    res.render('login.html');
});
router.get('/blog', function(req, res){
    res.render('blog.html');
})
router.get('/blog_details', function(req, res){
    res.render('blog_details.html');
});
router.get('/elements', function(req, res){
    res.render('elements.html');
});

module.exports = router;
