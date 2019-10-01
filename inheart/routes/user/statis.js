const router = require("express").Router();
// const mysql = require("mysql");
const con = require("../../db/db");
const { isLoggedIn } = require("../../check/check");
const util = require("../../check/util");
const auth = require("./auth")();

router.post("/", auth.authenticate(), isLoggedIn, (req, res, next) => {
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

    let q =
        "insert into conlog values('0','" +
        userNo +
        "','" +
        new Date().toFormat("YYYY-MM-DD HH24:MI:SS") +
        "');";
    console.log(q);

    con.query(q, (err, result, fields) => {
        if (err) {
            //에러체크
            return res.status(400).json(util.successFalse(err, "입력 실패"));
        }

        if (result && result.length != 0) {
            //result 결과값이 있으면

            console.log(result);
            return res.status(201).json(util.successTrue(result));
        } else {
            return res.sendStatus(204);
        }
    });
});

router.options("/", (req, res) => {
    res.sendStatus(200);
});

router.all("/", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

module.exports = router;
