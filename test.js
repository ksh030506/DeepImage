var fs = require('fs');  
  
// // 파일시스템 모듈을 이용하여 이미지를 읽은후 base64로 인코딩하기  
// function base64_encode(file) {  
//     // 바이너리 데이터 읽기 file 에는 파일의 경로를 지정  
//     var bitmap = fs.readFileSync(file);  
//     //바이너리 데이터를 base64 포멧으로 인코딩하여 스트링 획등  
//     return new Buffer(bitmap).toString('base64');  
// }  

require('dotenv').config();
const express = require('express');
const app = express();
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const dbconfig = require('./config/dbconfig');
const dbOptions = dbconfig;

const connection = mysql.createConnection(dbOptions);
connection.query('USE ' + dbconfig.database);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({extended: false}));
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



connection.query(`select * from user_image where userEmail = ?`, ['llmm030506@gmail.com'], function(err, rows, fields){
    if(err) console.log(err);

    let image;
    for(var i = 3; i < rows.length; i++){
        image = rows[i].image;
        //console.log(image);
        base64_decode(image, './upload/chimage/copy'+ i +'.jpg');
        console.log("완료!!");
    }
    
    
});