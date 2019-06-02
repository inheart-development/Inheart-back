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
const contentsRouter = require("./routes/user/contents");
const faqRouter = require("./routes/user/faq");
const feelRouter = require("./routes/user/feel");
const noticeRouter = require("./routes/user/notice");
const starRouter = require("./routes/user/star");
const statisRouter = require("./routes/user/statis");
const surveyRouter = require("./routes/user/survey");
const userRouter = require("./routes/user/user");
const admin_contentsRouter = require("./routes/admin/contents");
const admin_faqRouter = require("./routes/admin/faq");
const admin_serveyRouter = require("./routes/admin/survey");
const admin_statisRouter = require("./routes/admin/statis");
const admin_userRouter = require("./routes/admin/user");
const adminRouter = require("./routes/admin/admin");
const passportUserConfig = require("./passport/passport_user");
const passportAdminConfig = require("./passport/passport_admin");

//---------------------router------------------------

const app = express();
passportUserConfig();
passportAdminConfig();
//passport 내부의 코드를 실행하기 위해
app.set("port", process.env.PORT || 3000);

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
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, X-Auth-Token, Authorization"
  );
  //res.header("Access-Control-Allow-Headers", "content-type");
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "deny");
  // res.header("Content-Security-Policy", "default-src 'none'");
  res.removeHeader("x-Powered-By");
  //res.header("Content-Type", "application/json; charset=utf-8");

  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', function (req, res, next) {
//     console.log(req.headers)
//     var contype = req.headers['content-type'];
//     if (!contype || contype.indexOf('application/json') !== 0)
//         return res.status(406).json(util.successFalse(null, "content-type을 application/json으로 지정해주세요"));
//     next();
// });

// app.use("/img", express.static("img"));
app.use("/meditation", express.static(path.join(__dirname, "meditation")));
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
app.use("/admin/statis", admin_statisRouter);
app.use("/admin/contents", admin_contentsRouter);
app.use("/admin/faq", admin_faqRouter);
app.use("/admin/survey", admin_serveyRouter);
app.use("/admin/user", admin_userRouter);
app.use("/admin", adminRouter);
//app.use("/")
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
