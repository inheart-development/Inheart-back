const mysql=require('mysql');

const con=mysql.createConnection({
    host:'192.168.0.82',
    user:'root',
    password:'zero8787',
    database:'inheart'
});
con.connect(function (err) {
    if (err) throw err;
    console.log('ok');
});

module.exports= con;