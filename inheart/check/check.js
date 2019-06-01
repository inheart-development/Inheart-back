const util = require("../check/util");

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status.json(util.successFalse(null, "로그인 필요"));
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        //리다이렉트 대신 json 파일로 응답 --> rest api는 데이터만 제공하기 때문에
        return res
            .status(400)
            .json(util.successFalse(null, "로그인이 되어있는 상태입니다"));
    }
};
