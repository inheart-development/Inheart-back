const router = require("express").Router();
const con = require("../../db/db");
const util = require("../../check/util");

router.get("/day", (req, res, next) => {
    con.query(
        "select DATE(conlogDate) as 'day',count(*) as 'count' from conlog group by DATE(conlogDate); ",
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

router.get("/allDay", (req, res, next) => {
    con.query("select count(*) as count from conlog", (err, result, fields) => {
        if (err) {
            //에러체크
            return res.status(400).json(util.successFalse(err, "검색 실패"));
        }

        if (result && result.length != 0) {
            //result 결과값이 있으면

            console.log(result);
            return res.status(200).json(util.successTrue(result[0]));
        } else {
            return res.sendStatus(204);
        }
    });
});

router.options("/day", (req, res) => {
    res.sendStatus(200);
});

router.options("/allday", (req, res) => {
    res.sendStatus(200);
});

router.all("/day", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

router.all("/allDay", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

module.exports = router;
