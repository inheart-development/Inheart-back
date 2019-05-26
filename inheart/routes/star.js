const express = require("express");
const router = require("express").Router();
const mysql = require("mysql");
const con = require("../db/db");
const { isLoggedIn } = require("../check/check");
const util = require("../check/util");
const auth = require("./auth")();

router.get("/list", auth.authenticate(), (req, res, next) => {
    const { categoryNo } = req.query;

    const userNo = req.user.userNo;
    if (userNo === -1)
        return res
            .status(401)
            .json(
                util.successFalse(
                    null,
                    "토큰으로 부터 유저정보를 얻을 수 없습니다."
                )
            );

    con.query(
        "select c.* from contents c where c.categoryNo =? and c.contentsNo in (select s.contentsNo from star s where s.userNo =?) order by contentsIndex",
        [categoryNo, userNo],
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

router.post("/", auth.authenticate(), (req, res, next) => {
    const { contentsNo } = req.body;
    //let q = "insert into star (starNo,userNo,contentsNo) values('0','" + userNo + "','" + contentsNo + "');";
    //console.log(q)

    const userNo = req.user.userNo;
    if (userNo === -1)
        return res
            .status(401)
            .json(
                util.successFalse(
                    null,
                    "토큰으로 부터 유저정보를 얻을 수 없습니다."
                )
            );

    con.query(
        "insert into star (starNo,userNo,contentsNo) values('0','?','?')",
        [userNo, contentsNo],
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

router.delete("/", auth.authenticate(), (req, res, next) => {
    const { contentsNo } = req.body;
    //let q = "delete from star where userNo = '" + userNo + "' and contentsNo = '" + contentsNo + "';";
    //console.log(q)\

    const userNo = req.user.userNo;
    if (userNo === -1)
        return res
            .status(401)
            .json(
                util.successFalse(
                    null,
                    "토큰으로 부터 유저정보를 얻을 수 없습니다."
                )
            );

    con.query(
        "delete from star where userNo=? and contentsNo=?",
        [userNo, contentsNo],
        (err, result, fields) => {
            if (err) {
                //에러체크
                return res
                    .status(400)
                    .json(util.successFalse(err, "삭제 실패"));
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

router.get("/", auth.authenticate(), (req, res, next) => {
    const { contentsNo } = req.query;

    const userNo = req.user.userNo;
    if (userNo === -1)
        return res
            .status(401)
            .json(
                util.successFalse(
                    null,
                    "토큰으로 부터 유저정보를 얻을 수 없습니다."
                )
            );

    con.query(
        "select * from star where userNo =? and contentsNo=?",
        [userNo, contentsNo],
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

module.exports = router;
