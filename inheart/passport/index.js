const local = require('./localStrategy.js');

module.exports = (passport) => {
    passport.serializeUser((user, done) => { //req.session 객체에 어떤 데이터를 저장할지 선택
        done(null, user); //세션에 사용자 정보를 모두 저장하면 용량이 커지고 일관성에 문제가 발생하므로 사용자의 아이디(user.id)만 저장한다
    });

    passport.deserializeUser((id, done) => { //매 요청시 실행, passport.session() 미들웨어가 이 메서드 호출
        //serializeUser에서 저장했던 아이디를 받아 DB에서 사용자 정보 조회, 조회한 정보를 req.user에 저장하므로 req.user를 통해 로그인한 사용자 정보를 가져올 수 있음
        done(null, user);
    });
    local(passport);
};