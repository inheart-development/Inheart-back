const createError = require("http-errors");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const nowTime = require("date-utils");
const passport = require("passport");
const flash = require("connect-flash");
const util = require("./check/util");
require("dotenv").config();
//---------------------router----------------------
const contentsRouter = require("./routes/contents");
const faqRouter = require("./routes/faq");
const feelRouter = require("./routes/feel");
const noticeRouter = require("./routes/notice");
const starRouter = require("./routes/star");
const statisRouter = require("./routes/statis");
const surveyRouter = require("./routes/survey");
const userRouter = require("./routes/user");
const passportConfig = require("./passport/passport");

//---------------------router------------------------

const app = express();
passportConfig(); //passport 내부의 코드를 실행하기 위해
app.set("port", process.env.PORT || 8001);

app.use(morgan("dev"));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        name: "sessionID",
        resave: false,
        saveUninitialized: true,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false
        }
    })
);
app.use(flash());
app.use(passport.initialize()); //요청 객체에 passport설정을 심는다
app.use(passport.session()); //express-session에서 생성하는 것이므로 express-session 뒤에 연결 해야 된다

// app.all('/*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
// });

//미들웨어 설정
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "content-type, Authorization");
    //res.header("Access-Control-Allow-Headers", "content-type");
    res.header("X-Content-Type-Options", "nosniff");
    res.header("X-Frame-Options", "deny");
    res.header("Content-Security-Policy", "default-src 'none'");
    res.removeHeader("x-Powered-By");
    res.header("Content-Type", "application/json");

    next();
});

// app.use('/', function (req, res, next) {
//     console.log(req.headers)
//     var contype = req.headers['content-type'];
//     if (!contype || contype.indexOf('application/json') !== 0)
//         return res.status(406).json(util.successFalse(null, "content-type을 application/json으로 지정해주세요"));
//     next();
// });

// app.use("/img", express.static("img"));
app.use("/sound", express.static("sound"));
app.use("/pImg", express.static(path.join(__dirname, "profileImage"))); //profileImage에 있는 사진들이 pImg 주소로 제공된다.
//---------------------router------------------------

app.use("/contents", contentsRouter);
app.use("/faq", faqRouter);
app.use("/feel", feelRouter);
app.use("/notice", noticeRouter);
app.use("/star", starRouter);
app.use("/statis", statisRouter);
app.use("/survey", surveyRouter);
app.use("/user", userRouter);
//---------------------router------------------------

app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    return res.status(404).json(util.successFalse(err, "파일 찾을 수 없음"));
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
});
