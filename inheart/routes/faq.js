const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const con = require('../db/db');
const {
    isLoggedIn
} = require('../check/check');

const util = require("../check/util");

router.get('/list', (req, res, next) => {
    const {} = req.body;



    let q = "select * from faq;";
    console.log(q)
    con.query(q, (err, result, fields) => {
        if(err){ //에러체크
            return res.status(400).json(util.successFalse(err,"검색"));
        }
        

        if (result && result.length != 0) { //result 결과값이 있으면
  
            console.log(result);
            return res.status(200).json(util.successTrue(result));
        } else {
            return res.sendstatus(204)               
        }
    });
});

module.exports = router;