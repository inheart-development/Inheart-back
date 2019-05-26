const passport = require("passport");
const passportJWT = require("passport-jwt");
const cfg = require("../secret/jwt_config");
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
    // JWT 비밀키
    secretOrKey: cfg.jwtSecret,
    // 클라이언트에서 서버로 토큰을 전달하는 방식  (header, querystring, body 등이 있다.)
    // header 의 경우 다음과 같이 써야 한다 { key: 'Authorization', value: 'JWT ' + 토큰
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT")
};
const con = require("../db/db");

module.exports = function() {
    let strategy = new Strategy(params, function(payload, done) {
        // TODO write authentications to find users from a database
        let user = true;

        //user 유효성 검사

        let q = "select * from user where userNo='" + payload.userNo + "'";
        con.query(q, (err, result, fields) => {
            if (result.length == 1) {
                return done(null, {
                    userNo: payload.userNo
                });
            } else {
                return done(null, {
                    userNo: -1
                });
            }
        });
    });
    passport.use(strategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};
