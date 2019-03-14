const express=require('express');
const morgan=require('morgan');
const path=require('path');
const session=require('express-session');
const cookieParser=require('cookie-parser');
const mysql=require('mysql');
const bodyparser=require('body-parser');
const nowTime=require('date-utils');
//---------------------router----------------------
const contentsRouter=require('./routes/contents');
const faqRouter=require('./routes/faq');
const feelRouter=require('./routes/feel');
const noticeRouter=require('./routes/notice');
const starRouter=require('./routes/star');
const statisRouter=require('./routes/statis');
const surveyRouter=require('./routes/survey');
const userRouter=require('./routes/user');

//---------------------router------------------------

// const con=mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'zero8787',
//     database:'inheart'
// });
// con.connect(function (err) {
// 	if (err) throw err;
// 	console.log("Connected!");
// });

const app=express();
app.set('port',process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

app.use('/img',express.static('img'));
//---------------------router------------------------
app.use('/contents',contentsRouter); 
app.use('/faq',faqRouter);
app.use('/feel',feelRouter);
app.use('/notice',noticeRouter);
app.use('/star',starRouter);
app.use('/statis',statisRouter);
app.use('/survey',surveyRouter);
app.use('/user',userRouter);
//---------------------router------------------------

app.use((req,res,next)=>{
    const err=new('Not Found');
    err.status=404;
    next(err);
});

app.use((err,req,res)=>{
    res.locals.message=err.message;
    res.locals.error=req.app.get('env')==='development' ? err:{};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중');
});