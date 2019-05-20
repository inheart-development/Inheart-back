const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const con = require('../db/db');


router.post('/catestarlist', (req, res, next) => {
    const {
        categoryNo,
        userNo
    } = req.body;
    // let q = "select c.*, (if(c.contentsNo in(select s.contentsNo  from star s where userNo = '" + userNo + "') ,True,False)) contentsStar from contents c where c.categoryNo = '" + categoryNo + "' order by contentsIndex;";
    //console.log(q)
    con.query("select c.*,(if(c.contentsNo in(select s.contentsNo from start s where userNo=?),True,False)) contentsStar from contents c where c.categoryNo=? order by contentsIndex", [userNo, categoryNo], (err, result, fields) => {
        if (result && result.length != 0) {
            console.log(result);
            return res.status(200).json(result);

        } else {
            return res.sendStatus(204);

        }
    });


});

router.post('/catelist', (req, res, next) => {
    const {
        categoryNo
    } = req.body;
    //let q = "select * from contents where categoryNo = '" + categoryNo + "' order by contentsIndex;";
    //console.log(q)
    con.query("select * from contents where categoryNo =? order by contentsIndex", [categoryNo], (err, result, fields) => {
        if (result && result.length != 0) {
            console.log(result);
            return res.status(200).json(result);

        } else {
            return res.sendStatus(204);

        }
    });
});

router.post('/content', (req, res, next) => {
    const {
        contentsNo
    } = req.body;
    //let q = "select * from contents where contentsNo = '" + contentsNo + "' order by contentsIndex;";
    //console.log(q)
    con.query("select * from contents where contentsNo=? order by contentsIndex", [contentsNo], (err, result, fields) => {
        if (result && result.length != 0) {
            console.log(result);
            return res.status(200).json(result);

        } else {
            return res.sendStatus(204);

        }
    });
});

router.get('/contentslist', (req, res, next) => {
    const {} = req.body;
    //let q = "select * from contents order by contentsIndex;";
    //console.log(q)
    con.query("select * from contents order by contentsIndex", (err, result, fields) => {
        if (result && result.length != 0) {
            console.log(result);
            return res.status(200).json(result);

        } else {
            return res.sendStatus(204);

        }
    });
});

router.post('/initstar', (req, res, next) => {
    const {
        userNo,
        contentsNo
    } = req.body;
    //let q = "insert into star (starNo,userNo,contentsNo) values('0','" + userNo + "','" + contentsNo + "');";
    //console.log(q)
    con.query("insert into star (starNo,userNo,contentsNo)j values('0','?','?')", [userNo, contentsNo], (err, result, fields) => {

        if (err) {
            return res.sendStatus(204);
            throw err;
        }
        // if there is no error, you have the result
        console.log(result);
        return res.sendStatus(201)
    });
});

router.delete('/delstar', (req, res, next) => {
    const {
        userNo,
        contentsNo
    } = req.body;
    //let q = "delete from star where userNo = '" + userNo + "' and contentsNo = '" + contentsNo + "';";
    //console.log(q)
    con.query("delete from star where userNo=? and contentsNo=?", [userNo, contentsNo], (err, result, fields) => {

        if (err) {
            return res.sendStatus(204);
            throw err;
        }
        // if there is no error, you have the result
        console.log(result);
        return res.sendStatus(200)
    });
});

router.post('/constar', (req, res, next) => {
    const {
        userNo,
        contentsNo
    } = req.body;

    //let q = "select * from star where userNo = '" + userNo + "' and contentsNo = '" + contentsNo + "';";
    //console.log(q)


    con.query("select * from star where userNo =? and contentsNo=?", [userNo, contentsNo], (err, result, fields) => {
        if (result && result.length != 0) {

            return res.sendStatus(200);

        } else {
            return res.sendStatus(204);

        }
    });
});

module.exports = router;