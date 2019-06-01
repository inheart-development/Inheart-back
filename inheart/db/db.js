const mysql = require("mysql");

const con = mysql.createConnection({
    host: "54.180.153.125",
    user: "root",
    password: "1234",
    database: "inheart"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("ok");
});

module.exports = con;