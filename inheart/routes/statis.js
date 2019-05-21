const express = require('express');
const router = require('express').Router();
const mysql = require('mysql');
const con = require('../db/db');
const {
    isLoggedIn
} = require('../check/check');
const util = require("../check/util");


router.post('', isLoggedIn, (req, res, next) => {
    const {
        userNo,
    } = req.body;
    let q = "insert into conlog values('0','" + userNo + "','" + new Date().toFormat("YYYY-MM-DD HH24:MI:SS") + "');";
    console.log(q)

    con.query(q, (err, result, fields) => {

        if(err){ //에러체크
            return res.status(400).json(util.successFalse(err,"입력 실패"));
        }
        

        if (result && result.length != 0) { //result 결과값이 있으면
  
            console.log(result);
            return res.status(201).json(util.successTrue(result));
        } else {
            return res.sendstatus(204)               
        }

    });
});

module.exports = router;