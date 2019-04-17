const express = require('express');
const router = require('express').Router();
const mysql = require('mysql');
const con = require('../db/db');
const {
    isLoggedIn
} = require('./logincheck');

router.post('/init', isLoggedIn, (req, res, next) => {
    const {
        userNo,
    } = req.body;
    let q = "insert into conlog values('0','" + userNo + "','" + new Date().toFormat("YYYY-MM-DD HH24:MI:SS") + "');";
    console.log(q)

    con.query(q, (err, result, fields) => {

        if (err) {
            return res.sendStatus(204);
            throw err;
        }
        // if there is no error, you have the result
        console.log(result);
        return res.sendStatus(201);

    });
});

module.exports = router;