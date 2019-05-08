const LocalStrategy = require('passport-local').Strategy;
const con = require('../db/db');
const crypto = require('crypto');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'userEmail',
        passwordField: 'userPw',
    }, async (userEmail, userPW, done) => {
        try {
            let Pw = crypto.createHash('sha512').update(userPw).digest('base64');
            let q = "select * from user where userEmail = '" + userEmail + "' and userPw = '" + Pw + "'";
            exUser = con.query(q, (err, result, fields) => {

                if (result && result.length != 0) {
                    //console.log(result);
                    var getUserNo = result[0].userNo;
                    console.log(getUserNo);
                    let q2 = "insert into conlog values('0','" + getUserNo + "','" + new Date().toFormat("YYYY-MM-DD HH24:MI:SS") + "');";
                    con.query(q2, (err, result, fields) => {});

                    done(null, result[0]); //성공시 user정보 전송

                } else {
                    return res.sendStatus(204);

                }
            });
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};