const router = require("express").Router();
// const mysql = require("mysql");
const con = require("../../db/db");
const { isLoggedIn, isNotLoggedIn } = require("../../check/check");
const auth = require("./auth")();
const util = require("../../check/util");

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

    // let q = "select * from survey where userNo = '" + userNo + "';";

    con.query(
        "select * from survey where userNo =?",
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

router.get("/title/list", (req, res, next) => {
    con.query(
        "select surveyTitleNo, surveyTitle from surveyTitle;",
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

router.get("/", auth.authenticate(), (req, res, next) => {
    const { surveyNo } = req.query;

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

    // let q = "select * from survey where userNo = '" + userNo + "';";

    con.query(
        "select d.surveyTitleNo, t.surveyTitle, d.surveyValue from surveydata d, surveyTitle t where d.surveyNo = ? and d.surveyTitleNo = t.surveyTitleNo;",
        [surveyNo],
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
    const {
        survey_1,
        survey_2,
        survey_3,
        survey_4,
        survey_5,
        survey_6,
        survey_7,
        survey_8
    } = req.body;

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
        "insert into survey values('0','" +
        userNo +
        "','" +
        new Date().toFormat("YYYY-MM-DD HH24:MI:SS") +
        "')";
    console.log(q);
    con.query(q, (err, result, fields) => {
        if (err) {
            //에러체크
            return res.status(400).json(util.successFalse(err, "입력 실패"));
        }

        if (result && result.length != 0) {
            //result 결과값이 있으면

            console.log(result);
        }

        var surveyNo = result.insertId;

        //조금 더 좋은 방법이 있을 것 같다
        con.query(
            "insert into surveyData values('0',?,'1','?'),('0',?,'2','?'),('0',?,'3','?'),('0',?,'4','?'),('0',?,'5','?'),('0',?,'6','?'),('0',?,'7','?'),('0',?,'8','?');",
            [
                surveyNo,
                survey_1,
                surveyNo,
                survey_2,
                surveyNo,
                survey_3,
                surveyNo,
                survey_4,
                surveyNo,
                survey_5,
                surveyNo,
                survey_6,
                surveyNo,
                survey_7,
                surveyNo,
                survey_8
            ],
            (err2, result2, fields2) => {
                if (err2) {
                    //에러체크
                    return res
                        .status(400)
                        .json(util.successFalse(err, "입력 실패"));
                }
                if (result2 && result2.length != 0) {
                    //result 결과값이 있으면

                    console.log(result2);
                    return res.status(200).json(util.successTrue(result2));
                } else {
                    return res.sendStatus(204);
                }
            }
        );
    });
});

router.options("/list", (req, res) => {
    res.sendStatus(200);
});

router.options("/title/list", (req, res) => {
    res.sendStatus(200);
});

router.options("/", (req, res) => {
    res.sendStatus(200);
});

router.all("/list", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

router.all("/title/list", (req, res, next) => {
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
