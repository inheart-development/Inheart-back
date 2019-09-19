const mysql = require("mysql");

const con = mysql.createConnection({
    host: process.env.DB_IP,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    charset: "utf8"
});
con.connect(function(err) {
    if (err) throw err;
    console.log("ok");
});

module.exports = con;
