const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
// const fs = require('fs');
const con = require("../db/db");
const util = require("../check/util");
const auth = require("./auth")();

const { isLoggedIn } = require("../check/check");

const upload2 = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, "feelImage/");
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname); //파일의 확장자를 ext에 저장
            cb(
                null,
                path.basename(file.originalname, ext) +
                    new Date().valueOf() +
                    ext
            ); //파일이름+업로드날짜+확장자
        }
    })
});

router.get("/", auth.authenticate(), (req, res, next) => {
    const { feelNo } = req.query;

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

    // let q = "select * from feel where feelNo = '" + feelNo + "';";

    // console.log(q)
    con.query(
        "select * from feel where feelNo =?",
        [feelNo],
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

    // let q = "select * from feel where userNo = '" + userNo + "' and feelType like '%" + feelType + "%' ;";

    // console.log(q)

    // [] 이거 안에 넣으면 ' ' 이거 들어가서 일딴 뺐음
    con.query(
        "select f.*, t.feelTypeName from feel f, feelType t where f.feelTypeNo = t.feelTypeNo and f.userNo = ?;",
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

router.get("/type/list", auth.authenticate(), (req, res, next) => {
    const { feelTypeNo } = req.query;

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

    // let q = "select * from feel where userNo = '" + userNo + "' and feelType like '%" + feelType + "%' ;";

    // console.log(q)

    // [] 이거 안에 넣으면 ' ' 이거 들어가서 일딴 뺐음
    con.query(
        "select f.*, t.feelTypeName from feel f, feelType t where f.feelTypeNo = t.feelTypeNo and f.feelTypeNo = ? and f.userNo = ?;",

        [feelTypeNo, userNo],
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

router.post(
    "/",
    auth.authenticate(),
    isLoggedIn,
    upload2.single("feelImage"),
    (req, res, next) => {
        const { contentsNo, feelText, feelTime, feelType } = req.body;

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

        let feelImgname = req.file.filename;
        let q =
            "insert into feel values('0','" +
            userNo +
            "','" +
            contentsNo +
            "','" +
            new Date().toFormat("YYYY-MM-DD HH24:MI:SS") +
            "','" +
            feelImgname +
            "','" +
            "'0','" +
            feelText +
            "','" +
            feelTime +
            "','" +
            feelType +
            "')";
        console.log(q);
        con.query(q, (err, result, fields) => {
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
        });
    }
);

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

router.all("/type/list", (req, res, next) => {
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
