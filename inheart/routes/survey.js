const express = require('express');
const router = require('express').Router();
const mysql = require('mysql');
const con = require('../db/db');
const {
    isLoggedIn,
    isNotLoggedIn
} = require('../check/check');


router.get('/list', isLoggedIn, (req, res, next) => {
    const {
        userNo
    } = req.body;
    // let q = "select * from survey where userNo = '" + userNo + "';";

    con.query("select * from survey where userNo =?", [userNo], (err, result, fields) => {
        if(err){ //에러체크
            return res.status(400).json(util.successFalse(err,"검색 실패"));
        }
        

        if (result && result.length != 0) { //result 결과값이 있으면
  
            console.log(result);
            return res.status(200).json(util.successTrue(result));
        } else {
            return res.sendStatus(204)               
        }
    });
});

router.post('/', isLoggedIn, (req, res, next) => {
    const {
        userNo,
        survey_1,
        survey_2,
        survey_3,
        survey_4,
        survey_5,
        survey_6,
        survey_7,
        survey_8
    } = req.body;

    let q = "insert into survey values('0','" + userNo + "','" + new Date().toFormat("YYYY-MM-DD HH24:MI:SS") + "'," + survey_1 + "," + survey_2 + "," + survey_3 + "," + survey_4 + "," + survey_5 + "," + survey_6 + "," + survey_7 + "," + survey_8 + ")";
    console.log(q)
    con.query(q, (err, result, fields) => {

        if(err){ //에러체크
            return res.status(400).json(util.successFalse(err,"입력 실패"));
        }
        

        if (result && result.length != 0) { //result 결과값이 있으면

            console.log(result);
            return res.status(201).json(util.successTrue(result));
        } else {
            return res.sendStatus(204)               
        }
    });
});


router.all('/list',(req,res,next)=>{
    return res.status(405).json(util.successFalse(null,"요청 메서드를 확인하세요"))
});

router.all('/',(req,res,next)=>{
    return res.status(405).json(util.successFalse(null,"요청 메서드를 확인하세요"))
});

module.exports = router;