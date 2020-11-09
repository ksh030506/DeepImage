var express = require('express');
const morgan = require('morgan');
var app = express();
var GetHtml = require('./routes/GetHtml');
var UserApi = require('./routes/UserApi');
var DbTest = require('./routes/dbTest');


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/test', DbTest);
app.use('/',GetHtml);
app.use('/user', UserApi);


var server = app.listen(8080, function(){
    console.log("Express server has started on port 8080")
});