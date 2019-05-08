const mysql=require('mysql');


const con=mysql.createConnection({
    host:'localhost',
    user:'root',     //계정 변경
    password:'1234',
    database:'inheart'
});
con.connect(function (err) {
    if (err) throw err;
    console.log('ok');
});

module.exports= con;
