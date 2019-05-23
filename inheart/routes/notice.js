const express = require("express");
const router = require("express").Router();
const mysql = require("mysql");
const con = require("../db/db");
const { isLoggedIn } = require("../check/check");
const util = require("../check/util");

router.post("/list", isLoggedIn, (req, res, next) => {
    const { userNo } = req.body;
    // let q = "select * from notice where userNo = '" + userNo + "';";

    // console.log(q)
    con.query(
        "select * from notice where userNo =?",
        [userNo],
        (err, result, fields) => {
            if (err) {
                //에러체크
                return res
                    .status(400)
                    .json(util.successFalse(err, "검색 실패"));
            }

            if (result && result.length != 0) {
                //result 결과값이 있으면

                console.log(result);
                return res.status(200).json(util.successTrue(result));
            } else {
                return res.sendStatus(204);
            }
        }
    );
});

router.post("/", isLoggedIn, (req, res, next) => {
    const { userNo, noticeTime, noticeBool } = req.body;
    // let q = "insert into notice values('0','" + userNo + "','" + noticeTime + "'," + noticeBool + ");";
    // console.log(q)
    con.query(
        "insert into notice values(0,?,?,?)",
        [userNo, noticeTime, noticeBool],
        (err, result, fields) => {
            if (err) {
                //에러체크
                return res
                    .status(400)
                    .json(util.successFalse(err, "입력 실패"));
            }

            if (result && result.length != 0) {
                //result 결과값이 있으면

                console.log(result);
                return res.status(201).json(util.successTrue(result));
            } else {
                return res.sendStatus(204);
            }
        }
    );
});

router.post("/on-off", isLoggedIn, (req, res, next) => {
    const { noticeBool, noticeNo } = req.body;
    // let q = "update notice set noticeBool = " + noticeBool + " where noticeNo = " + noticeNo + ";";

    // console.log(q)

    con.query(
        "update notice set noticeBool=? where noticeNo=?",
        [noticeBool, noticeNo],
        (err, result, fields) => {
            if (err) {
                //에러체크
                return res
                    .status(400)
                    .json(util.successFalse(err, "업데이트 실패"));
            }

            if (result && result.length != 0) {
                //result 결과값이 있으면

                console.log(result);
                return res.status(200).json(util.successTrue(result));
            } else {
                return res.sendStatus(204);
            }
        }
    );

    return;
});

router.all("/list", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

router.all("/", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});
router.all("/on-off", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

//알림 삭제 추가하기

module.exports = router;
