const router = require("express").Router();
const con = require("../../db/db");
const util = require("../../check/util");

router.get("/list", (req, res, next) => {
    con.query("select * from faq;", (err, result, fields) => {
        if (err) {
            //에러체크
            return res.status(400).json(util.successFalse(err, "검색 실패"));
        }

        if (result && result.length != 0) {
            //result 결과값이 있으면

            console.log(result);
            return res.status(200).json(util.successTrue(result));
        } else {
            return res.sendStatus(204);
        }
    });
});

router.get("/", (req, res, next) => {
    const { faqNo } = req.query;

    con.query(
        "select * from faq where faqNo = ?;",
        [faqNo],
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

router.post("/", (req, res, next) => {
    const { faqQuestion, faqAnswer } = req.body;

    con.query(
        "insert into faq values('0',?,?);",
        [faqQuestion, faqAnswer],
        (err, result, fields) => {
            if (err) {
                //에러체크
                return res
                    .status(401)
                    .json(util.successFalse(err, "입력 실패"));
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

router.put("/", (req, res, next) => {
    const { faqQuestion, faqAnswer, faqNo } = req.body;

    con.query(
        "update faq set faqQuestion = ?, faqAnswer = ? where faqNo = ?;",
        [faqQuestion, faqAnswer, faqNo],
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
});

router.delete("/", (req, res, next) => {
    const { faqNo } = req.body;

    con.query(
        "delete from faq where faqNo = ?;",
        [faqNo],
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

router.options("/", (req, res) => {
    res.sendStatus(200);
});

router.options("/list", (req, res) => {
    res.sendStatus(200);
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
