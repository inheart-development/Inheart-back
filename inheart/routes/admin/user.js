const router = require("express").Router();
const con = require("../../db/db");
const util = require("../../check/util");

router.get("/list", (req, res, next) => {
    con.query(
        "select userNo, userEmail, userName, userImage from user;",
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

router.get("/meditotal", (req, res, next) => {
    const { userNo } = req.query;

    //userNo는 다 토큰형식으로 바꾼다

    // let q =
    //     "select c.categoryNo, (select count(*) from feel f where f.contentsNo in (select co.contentsNo from contents co where co.categoryNo = c.categoryNo) and userNo = '" +
    //     userNo +
    //     "') `count` from category = c";
    con.query(
        "select c.categoryNo, (select count(*) from feel f where f.contentsNo in (select co.contentsNo from contents co where co.categoryNo = c.categoryNo) and userNo =?) `count` from category = c",
        [userNo],
        (err, result, fields) => {
            if (err) {
                //에러체크
                return res
                    .status(400)
                    .json(util.successFalse(err, "입력 실패"));
            }

            result.pop();

            con.query(
                "select userEmail, userName, userImage from user where userNo = ?",
                [userNo],
                (err2, result2, fields2) => {
                    if (err) {
                        //에러체크
                        return res
                            .status(400)
                            .json(util.successFalse(err, "입력 실패"));
                    }

                    console.log(result2);

                    if (result2 && result2.length != 0) {
                        result2[0].categoryNo_1 = result[0].count;
                        result2[0].categoryNo_2 = result[1].count;
                        result2[0].categoryNo_3 = result[2].count;
                        result2[0].categoryNo_4 = result[3].count;

                        return res
                            .status(200)
                            .json(util.successTrue(result2[0]));
                    } else {
                        return res.sendStatus(204);
                    }
                }
            );
        }
    );
});

router.delete("/", (req, res, next) => {
    const { userNo } = req.body;

    let q = "delete from user where userNo =" + userNo;
    console.log(q);
    con.query(q, (err, result, fields) => {
        if (err) {
            //에러체크
            return res.status(400).json(util.successFalse(err, "삭제 실패"));
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

router.options("/list", (req, res) => {
    res.sendStatus(200);
});

router.options("/meditotal", (req, res) => {
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

router.all("/meditotal", (req, res, next) => {
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
