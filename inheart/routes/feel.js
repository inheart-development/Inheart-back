const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
// const fs = require('fs');
const con = require('../db/db');
const {
    isLoggedIn
} = require('../check/check');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'feelImage/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname); //파일의 확장자를 ext에 저장
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext); //파일이름+업로드날짜+확장자
        }
    })
});


router.post('/onefeel', isLoggedIn, (req, res, next) => {
    const {
        feelNo
    } = req.body;
    // let q = "select * from feel where feelNo = '" + feelNo + "';";

    // console.log(q)
    con.query("select * from feel where feelNo =?", [feelNo], (err, result, fields) => {
        if (result && result.length != 0) {
            console.log(result);
            return res.status(200).json(result.pop());

        } else {
            return res.sendStatus(204);

        }
    });
});

router.post('/listfeel', isLoggedIn, (req, res, next) => {
    const {
        userNo,
        feelType
    } = req.body;
    // let q = "select * from feel where userNo = '" + userNo + "' and feelType like '%" + feelType + "%' ;";

    // console.log(q)
    con.query("select * from feel where userNo =? and feelType like '%?%'", [userNo, feelType], (err, result, fields) => {
        if (result && result.length != 0) {
            console.log(result);
            return res.status(200).json(result);

        } else {
            return res.sendStatus(204);

        }
    });
});

router.post('/insertfeel', isLoggedIn, upload.single("feelImage"), (req, res, next) => {
    const {
        userNo,
        contentsNo,
        feelText,
        feelTime,
        feelType
    } = req.body;
    let q = "insert into feel values('0','" + userNo + "','" + contentsNo + "','" + new Date().toFormat("YYYY-MM-DD HH24:MI:SS") + "','" + feelNumber + "','" + "'0','" + feelText + "','" + feelTime + "','" + feelType + "')";
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