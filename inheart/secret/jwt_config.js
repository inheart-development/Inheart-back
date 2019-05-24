module.exports = {
    // 토큰을 인코딩/디코딩하기 위한 비밀키로 사용된다.
    jwtSecret: "ilovecode",
    //향후 배포시 안보이도록
    // Passport 세션을 이용하지 않도록 알려주는 역할을 한다.
    jwtSession: {
        session: false
    }
};
