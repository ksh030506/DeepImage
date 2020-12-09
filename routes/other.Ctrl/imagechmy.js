require('dotenv').config();
var fs = require('fs');
var express = require('express');
var app = express();
var mysql = require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var dbconfig = require('../../config/dbconfig');
var dbOptions = dbconfig;

var connection = mysql.createConnection(dbOptions);
connection.query('USE ' + dbconfig.database);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(session({
    secret: process.env.sessiohn_secret_key,
    store: new MySQLStore(dbOptions),
    resave: false,
    saveUninitialized: false
}));

//base64포멧의 스트링을 디코딩하여 파일로 쓰는 함수  
function base64_decode(base64str, file) {  
    // 버퍼 객체를 만든후 첫번째 인자로 base64 스트링, 두번째 인자는 파일 경로를 지정 파일이름만 있으면 프로젝트 root에 생성  
    var bitmap = new Buffer(base64str, 'base64');  
    // 버퍼의 파일을 쓰기  
    fs.writeFileSync(file, bitmap);
}  


const imageChPage = function(req, res){
    connection.query(`select * from user_image where userEmail = ?`, [req.session.userEmail], function(err, rows, fields){
        if(err) console.log(err);

        let image;
        let image_list = [];
        for(var i = 3; i < rows.length; i++){
            image = rows[i].image;
            base64_decode(image, './upload/chimage/copy'+ i +'.jpg');
            image_list.push('/chimage/copy'+ i +'.jpg');
        }
        console.log(image_list);
        res.render('imageCh', {user:req.session.userEmail, image_list: image_list});
    });
};

module.exports = imageChPage;