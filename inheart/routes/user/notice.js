const router = require("express").Router();
// const mysql = require("mysql");
const con = require("../../db/db");
const { isLoggedIn } = require("../../check/check");
const util = require("../../check/util");
const auth = require("./auth")();

router.get("/list", auth.authenticate(), (req, res, next) => {
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

router.post("/", auth.authenticate(), (req, res, next) => {
    const { noticeTime, noticeBool } = req.body;
    // let q = "insert into notice values('0','" + userNo + "','" + noticeTime + "'," + noticeBool + ");";
    // console.log(q)
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

router.post("/on-off", auth.authenticate(), (req, res, next) => {
    const { noticeBool, noticeNo } = req.body;
    // let q = "update notice set noticeBool = " + noticeBool + " where noticeNo = " + noticeNo + ";";

    // console.log(q)

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
        "update notice set noticeBool=? where noticeNo=? and userNo=?",
        [noticeBool, noticeNo, userNo],
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

router.options("/list", (req, res) => {
    res.sendStatus(200);
});

router.options("/", (req, res) => {
    res.sendStatus(200);
});

router.options("/on-off", (req, res) => {
    res.sendStatus(200);
});

router.all("/list", auth.authenticate(), (req, res, next) => {
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
