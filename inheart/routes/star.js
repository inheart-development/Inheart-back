const express = require('express');
const router = require('express').Router();
const mysql = require('mysql');
const con = require('../db/db');
const {
    isLoggedIn
} = require('../check/check');
const util = require("../check/util");


router.get('/list', isLoggedIn, (req, res, next) => {
    const {
        userNo,
        categoryNo
    } = req.body;
    // let q = "select c.* from contents c where c.categoryNo = '" + categoryNo + "' and c.contentsNo in (select s.contentsNo from star s where s.userNo = '" + userNo + "') order by contentsIndex; ";
    // console.log(q)

    con.query("select c.* from contents c where c.categoryNo =? and c.contentsNo in (select s.contentsNo from star s where s.userNo =?) order by contentsIndex", [categoryNo, userNo], (err, result, fields) => {
        if(err){ //에러체크
            return res.status(400).json(util.successFalse(err,"검색 실패"));
        }
        

        if (result && result.length != 0) { //result 결과값이 있으면
  
            console.log(result);
            return res.status(200).json(util.successTrue(result));
        } else {
            return res.sendstatus(204)               
        }
    });
});



router.post('/', (req, res, next) => {
    const {
        userNo,
        contentsNo
    } = req.body;
    //let q = "insert into star (starNo,userNo,contentsNo) values('0','" + userNo + "','" + contentsNo + "');";
    //console.log(q)
    con.query("insert into star (starNo,userNo,contentsNo)j values('0','?','?')", [userNo, contentsNo], (err, result, fields) => {

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

router.delete('/', (req, res, next) => {
    const {
        userNo,
        contentsNo
    } = req.body;
    //let q = "delete from star where userNo = '" + userNo + "' and contentsNo = '" + contentsNo + "';";
    //console.log(q)
    con.query("delete from star where userNo=? and contentsNo=?", [userNo, contentsNo], (err, result, fields) => {

        if(err){ //에러체크
            return res.status(400).json(util.successFalse(err,"삭제 실패"));
        }
        

        if (result && result.length != 0) { //result 결과값이 있으면
  
            console.log(result);
            return res.status(200).json(util.successTrue(result));
        } else {
            return res.sendstatus(204)               
        }
    });
});

router.get('/', (req, res, next) => {
    const {
        userNo,
        contentsNo
    } = req.body;

    //let q = "select * from star where userNo = '" + userNo + "' and contentsNo = '" + contentsNo + "';";
    //console.log(q)


    con.query("select * from star where userNo =? and contentsNo=?", [userNo, contentsNo], (err, result, fields) => {
        if(err){ //에러체크
            return res.status(400).json(util.successFalse(err,"검색 실패"));
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