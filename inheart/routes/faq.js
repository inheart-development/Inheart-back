const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const con = require("../db/db");
const { isLoggedIn } = require("../check/check");

const util = require("../check/util");

router.get("/list", (req, res, next) => {
    const {} = req.body;

    let q = "select * from faq;";
    console.log(q);
    con.query(q, (err, result, fields) => {
        if (err) {
            //에러체크
            return res.status(400).json(util.successFalse(err, "검색"));
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
router.all("/list", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

module.exports = router;
