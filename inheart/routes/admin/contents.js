const router = require("express").Router();
const con = require("../../db/db");
const util = require("../../check/util");

router.get("/list", (req, res, next) => {
    con.query(
        "select * from contents order by contentsIndex;",
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

router.get("/category/list", (req, res, next) => {
    const { categoryNo } = req.query;
    con.query(
        "select * from contents where categoryNo = 1 order by contentsIndex;",
        [categoryNo],
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

router.get("/", (req, res, next) => {
    const { contentsNo } = req.query;

    con.query(
        "select * from contents where contentsNo = ?;",
        [contentsNo],
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
    const {
        categoryNo,
        contentsTitle,
        contentsExplan,
        contentsFile,
        contentsType
    } = req.body;

    const contentsTime = "00:12:23"; //파일을 받아서 시간 확인 필요

    con.query(
        "insert into contents values('0',?,?,?,?,?,?,'1');",
        [
            categoryNo,
            contentsTitle,
            contentsExplan,
            contentsTime,
            contentsFile,
            contentsType
        ],
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

router.put("/", (req, res, next) => {
    const {
        categoryNo,
        contentsTitle,
        contentsExplan,
        contentsFile,
        contentsType,
        contentsNo
    } = req.body;

    const contentsTime = "00:12:23"; //파일을 받아서 시간 확인 필요

    con.query(
        "update contents set categoryNo = ?,contentsTitle = ?,contentsExplan = ?,contentsTime = ?,contentsFile = ?,contentsType = ? where contentsNo = ?;",
        [
            categoryNo,
            contentsTitle,
            contentsExplan,
            contentsTime,
            contentsFile,
            contentsType,
            contentsNo
        ],
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
    const { contentsNo } = req.body;

    con.query(
        "delete from contents where contentsNo = ?;",
        [contentsNo],
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

router.all("/category/list", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

module.exports = router;
