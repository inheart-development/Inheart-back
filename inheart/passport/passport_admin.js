const passport = require("passport");
const crypto = require('crypto');
const LocalStrategy = require("passport-local").Strategy;
const con = require("../db/db");
var jwt = require("jwt-simple");
var cfg = require("../secret/jwt_config");
const util = require("../check/util");

module.exports = () => {
    passport.serializeUser((admin, done) => {
        //성공 시 호출
        // console.log(user.userNo); // 출력 테스트 완료!
        done(null, admin.adminNo); //여기의 user가 deserializeUser의 첫번째 매개변수로 이동
    });

    passport.deserializeUser((adminNumber, done) => {
        //매 요청시 실행, passport.session() 미들웨어가 이 메서드 호출
        let q = "select * from admin where adminNo='" + adminNumber + "'";
        con.query(q, (err, result, fields) => {
            if (!err) done(null, adminNumber);
        });
        // done(null, user);
    });

    passport.use(
        "admin",
        new LocalStrategy({
                usernameField: "adminEmail",
                passwordField: "adminPassword",
                session: true,
                passReqToCallback: false
            },
            (adminEmail, adminPassword, done) => {

                con.query("select adminSalt from admin where adminEmail=?", [adminEmail], (err, result, fields) => {

                    const loginsalt = result[0] !== undefined? result[0].adminSalt : "0";
                    
                    console.log("loginSalt:", loginsalt);

                    crypto.pbkdf2(adminPassword, loginsalt, 12653, 64, 'sha512', (err, key) => {
                        const loginPw = key.toString('base64');
                        console.log("loginPw:", loginPw);

                        con.query(
                            "select * from admin where adminEmail=? and adminPassword=?",
                            [adminEmail, loginPw],
                            (err, result, fields) => {
                                if (err) return done(err);
                                else if (result == "") {
                                    console.log("아이디 또는 비밀번호가 틀렸습니다."); //출력 테스트 완료!
                                    done(null, false, {
                                        message: "등록되지 않은 관리자 계정입니다."
                                    });
                                } else {
                                    let getUserNo = result[0].userNo;
                                    let q2 =
                                        "insert into conlog values('0','" +
                                        getUserNo +
                                        "','" +
                                        new Date().toFormat("YYYY-MM-DD HH24:MI:SS") +
                                        "');";
        
                                    con.query(q2, (err, result, fields) => {}); //로그 찍히는거 테스트 완료!
        
                                    // console.log(result[0].userNo); //출력 테스트 완료!
        
                                    let payload = {
                                        userNo: getUserNo
                                    };
                                    let token = jwt.encode(payload, cfg.jwtSecret);
        
                                    //token: token
                                    let data = result[0];
                                    data.token = token;
        
                                    return done(null, data);
                                }
                            }
                        );
                    });
                });
            }
        )
    );
};