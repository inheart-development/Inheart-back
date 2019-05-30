const router = require("express").Router();
const multer = require("multer");
const con = require("../../db/db");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const passport = require("passport");
const {
    isLoggedIn,
    isNotLoggedIn
} = require("../../check/check");
const auth = require("./auth")();

const util = require("../../check/util");

var upload = multer({
    storage: multer.diskStorage({
        //서버 디스크에 저장
        destination(req, file, cb) {
            cb(null, "profileImage/"); //프사 저장 경로
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

router.post("/login", isNotLoggedIn, (req, res, next) => {
    passport.authenticate("local", (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            req.flash("loginError", info.message);
            return res.status(400).json(util.successFalse(null, info.message));
        }
        console.log("성공");
        console.log(user);
        return req.login(user, loginError => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }

            //리다이렉트를 하면안됨
            return res.json(util.successTrue(user));
        });
    })(req, res, next);
});

// router.post('/login', isNotLoggedIn, passport.authenticate('local', {
//     failureRedirect: '/'
// }), (req, res) => {
//     res.redirect('/');
//     console.log("성공");
// });

router.get("/logout", isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.status(200).json(util.successTrue("로그아웃 성공"));
});

router.post(
    //프사는 profileImage폴더에 파일이름+업로드날짜+확장자 로 저장한다.
    "/signup",
    // isNotLoggedIn,
    upload.single("userImage"),
    (req, res, next) => {
        // console.log("이미지파일:" + req.file);
        res.header("Access-Control-Allow-Headers", "multipart/form-data");
        const {
            userEmail,
            userName,
            userPw
        } = req.body;
        console.log(req.body);

        const signImgname = req.file.filename; //이미지이름
        let signPw = undefined;
        let signsalt = undefined;

        crypto.randomBytes(64, (err, buf) => { //pw단방향 암호화
            signsalt = buf.toString('base64');
            console.log("salt: " + signsalt);
            crypto.pbkdf2(userPw, signsalt, 12653, 64, 'sha512', (err, key) => {
                signPw = key.toString('base64');
                console.log("signPw: " + signPw);
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
                            "insert into user values('0',?,?,?,?,?)",
                            [userEmail, userName, signPw, signImgname, signsalt],
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
            });
        });
        console.log("솔트:" + signsalt);
    }
);

router.delete("/exit", auth.authenticate(), (req, res, next) => {
    const userNo = req.user.userNo;

    if (userNo === -1)
        return res
            .status(400)
            .json(
                util.successFalse(
                    null,
                    "토큰으로 부터 유저정보를 얻을 수 없습니다."
                )
            );

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

router.get("/meditotal", auth.authenticate(), (req, res, next) => {
    const userNo = req.user.userNo;

    if (userNo === -1)
        return res
            .status(400)
            .json(
                util.successFalse(
                    null,
                    "토큰으로 부터 유저정보를 얻을 수 없습니다."
                )
            );

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
                "select userEmail, userName from user where userNo = ?",
                [userNo],
                (err2, result2, fields2) => {
                    if (err) {
                        //에러체크
                        return res
                            .status(400)
                            .json(util.successFalse(err, "입력 실패"));
                    }

                    console.log(result2);

                    result2[0].categoryNo_1 = result[0].count;
                    result2[0].categoryNo_2 = result[1].count;
                    result2[0].categoryNo_3 = result[2].count;
                    result2[0].categoryNo_4 = result[3].count;

                    if (result && result.length != 0) {
                        return res.status(200).json(util.successTrue(result2));
                    } else {
                        return res.sendStatus(204);
                    }
                }
            );
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