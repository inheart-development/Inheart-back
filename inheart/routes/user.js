const express = require("express");
const router = require("express").Router();
const multer = require("multer");
const con = require("../db/db");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../check/check");

const util = require("../check/util");

fs.readdir("profileImage", error => {
    //프로필 사진 저장 폴더 확인
    if (error) {
        console.error(
            "profileImage 폴더가 없어 profileImage 폴더를 생성합니다."
        );
        fs.mkdirSync("profileImage");
    }
});

var userNumber;
let q2 = "select max(userNo)+1 from user"; //프로필 사진 이름
con.query(q2, (err, result, fields) => {
    userNumber = result;
});

const upload = multer({
    storage: multer.diskStorage({
        //서버 디스크에 저장
        destination(req, file, cb) {
            cb(null, "profileImage/"); //프사 저장 경로
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname); //파일의 확장자를 ext에 저장
            cb(null, userNumber + ext); //userNumber로 프사 저장
        }
    })
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
    passport.authenticate("local", (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            req.flash("loginError", info.message);
            return res.redirect("/");
        }
        return req.login(user, loginError => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect("/");
        });
    })(req, res, next);
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/"
    }),
    (req, res) => {
        res.redirect("/");
    }
);

router.get("/logout", isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("/");
});

router.post(
    "/signup",
    isNotLoggedIn,
    upload.single("userImage"),
    (req, res, next) => {
        res.header("Access-Control-Allow-Headers", "multipart/form-data");
        const { userName, userEmail, userPw } = req.body;
        let Pw = crypto
            .createHash("sha512")
            .update(userPw)
            .digest("base64");

        //console.log(userName+" "+userEmail+" "+userPw);
        // let q1 = "select userEmail from user where userName=" + userEmail;

        con.query(
            "select userEmail from user where userEmail=?",
            [userEmail],
            (err, result, fields) => {
                if (result && result.length != 0) {
                    return res
                        .status(400)
                        .json(
                            util.successFalse(null, "이미있는 아이디입니다.")
                        );
                }
                con.query(
                    "insert into user values('0',?,?,?,?)",
                    [userEmail, userName, Pw, userNumber],
                    (err, result, fields) => {
                        if (err) {
                            return res
                                .status(400)
                                .json(util.successFalse(err, "입력 실패"));
                        }

                        if (result && result.length != 0) {
                            console.log(result);
                            return res
                                .status(201)
                                .json(util.successTrue(result));
                        } else {
                            return res.sendStatus(204);
                        }
                    }
                );
            }
        );

        // var userNumber;
        // let q2="select max(userNo)+1 from user"; //프로필 사진 이름
        // con.query(q2,(err,result,fields)=>{
        //     userNumber=result;
        // });
        // console.log(userNumber);
        //--------------------------------------
        // let q =
        //     "insert into user values('0','" +
        //     userEmail +
        //     "','" +
        //     userName +
        //     "','" +
        //     Pw +
        //     "','" +
        //     userNumber +
        //     "')";
    }
);

router.delete("/exit", (req, res, next) => {
    const { userNo } = req.body;
    console.log(userNo);
    let q = "delete from user where userNo =" + userNo;
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

router.get("/meditotal", (req, res, next) => {
    const { userNo } = req.body;

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

            if (result && result.length != 0) {
                //result 결과값이 있으면
                //console.log(result);
                console.log(result);
                return res.status(201).json(util.successTrue(result));
            } else {
                return res.sendStatus(204);
            }
        }
    );
});

router.all("/login", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

router.all("/logout", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});
router.all("/signup", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});
router.all("/exit", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});
router.all("/meditotal", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

module.exports = router;
