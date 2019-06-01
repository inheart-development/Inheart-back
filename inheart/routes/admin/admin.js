const router = require("express").Router();
const passport = require("passport"); //TODO: passport 수정 또는 새로운 passport 추가 필요
const {
    isLoggedIn,
    isNotLoggedIn
} = require("../../check/check");

const util = require("../../check/util");

router.post("/login", isNotLoggedIn, (req, res, next) => {
    passport.authenticate("admin", (authError, admin, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!admin) {
            req.flash("loginError", info.message);
            return res.status(400).json(util.successFalse(null, info.message));
        }
        console.log("성공");
        console.log(admin);
        return req.login(admin, loginError => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }

            let explicitAdminData = admin;
            delete explicitAdminData.adminNo;
            delete explicitAdminData.adminPassword;
            delete explicitAdminData.adminSalt;
            delete explicitAdminData.token;

            //리다이렉트를 하면안됨
            return res.json(util.successTrue(admin));
        });
    })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.status(200).json(util.successTrue("로그아웃 성공"));
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

module.exports = router;