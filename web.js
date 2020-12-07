var express = require('express');
var app = express();
var Community = require('./routes/community');
var UserApi = require('./routes/auth');
var DbTest = require('./routes/dbTest');
var Other = require('./routes/Other');
var owner = require('./routes/owner');

app.use(express.static('public'));
app.use(express.static('upload'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/test', DbTest);
app.use('/', UserApi);
app.use('/', Community);
app.use('/', Other);
app.use('/', owner);


var server = app.listen(8080, function(){
    console.log("Express server has started on port 8080")
});