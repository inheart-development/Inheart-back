const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const con = require("../../db/db");
const util = require("../../check/util");
const auth = require("./auth")();

router.get("/star/list", auth.authenticate(), (req, res, next) => {
    const { categoryNo } = req.query;
    if (categoryNo == null) {
    }
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

    // let q = "select c.*, (if(c.contentsNo in(select s.contentsNo  from star s where userNo = '" + userNo + "') ,True,False)) contentsStar from contents c where c.categoryNo = '" + categoryNo + "' order by contentsIndex;";
    //console.log(q)
    con.query(
        "select c.*,(if(c.contentsNo in(select s.contentsNo from star s where userNo=?),True,False)) contentsStar from contents c where c.categoryNo=? order by contentsIndex",
        [userNo, categoryNo],
        (err, result, fields) => {
            if (err) {
                //에러체크
                return res
                    .status(400)
                    .json(util.successFalse(err, "검색 에러"));
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

router.get("/category/list", auth.authenticate(), (req, res, next) => {
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

    //let q = "select * from contents where categoryNo = '" + categoryNo + "' order by contentsIndex;";
    //console.log(q)
    con.query(
        "select * from contents where categoryNo =? order by contentsIndex",
        [categoryNo],
        (err, result, fields) => {
            if (err) {
                //에러체크
                return res
                    .status(400)
                    .json(util.successFalse(err, "리스트 확인"));
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

    //let q = "select * from contents where contentsNo = '" + contentsNo + "' order by contentsIndex;";
    //console.log(q)
    con.query(
        "select * from contents where contentsNo=? order by contentsIndex",
        [contentsNo],
        (err, result, fields) => {
            if (err) {
                //에러체크
                return res
                    .status(400)
                    .json(util.successFalse(err, "검색 에러"));
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

router.get("/list", auth.authenticate(), (req, res, next) => {
    const {} = req.body;

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

    //let q = "select * from contents order by contentsIndex;";
    //console.log(q)
    con.query(
        "select * from contents order by contentsIndex",
        (err, result, fields) => {
            if (err) {
                //에러체크
                return res
                    .status(400)
                    .json(util.successFalse(err, "검색 에러"));
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

router.all("star/list", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

router.all("category/list", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

router.all("/", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

router.all("/list", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

module.exports = router;
