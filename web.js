var express = require('express');
var app = express();
var Community = require('./routes/community');
var UserApi = require('./routes/UserApi');
var DbTest = require('./routes/dbTest');
var Other = require('./routes/Other');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/test', DbTest);
app.use('/', UserApi);
app.use('/', Community);
app.use('/', Other);


var server = app.listen(8080, function(){
    console.log("Express server has started on port 8080")
});