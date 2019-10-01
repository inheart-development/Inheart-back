const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_IP,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    charset: "utf8"
});

module.exports = pool;
