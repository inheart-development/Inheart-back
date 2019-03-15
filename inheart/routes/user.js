const express=require('express');
const router=require('express').Router();
const multer=require('multer');
const con=require('../db/db');
const path=require('path');

let storage = multer.diskStorage({
    destination: function(req, file ,callback){
      callback(null, "user/");
    },
    filename: function(req, file, callback){
      let extension=path.extname(file.originalname);
      callback(null,1+extension);
    }
  });
   
  let upload = multer({
    storage: storage
  });

router.post('/login',(req,res,next)=>{
    const {userEmail,userPw}=req.body;
    let q="select * from user where userEmail = '"+userEmail+"' and userPw = '"+userPw+"'";
    con.query(q,(err,result,fields)=>{
        
        if(result && result.length!=0){
            console.log(result);
            return res.status(200).json(result.pop());
            
        }
        else{
            return res.sendStatus(204);
        
        }     
    });
});

//아이디 중복,
router.post('/signup',upload.single("userImage"),(req,res,next)=>{
    res.header("Access-Control-Allow-Headers", "multipart/form-data");
    const {userName,userEmail,userPw}=req.body;
    //console.log(userName+" "+userEmail+" "+userPw);
    let q1="select userEmail from user where userName="+userEmail;
    con.query(q1,(err,result,fields)=>{
        if(result && result.length!=0){
            res.send("이미있는 아이디 입니다.");
        }
    });
    var userNumber;
    let q2="select max(userNo)+1 from user"; //프로필 사진 이름
    con.query(q2,(err,result,fields)=>{
        userNumber=result;
    });
    console.log(userNumber);
    let q="insert into user values('0','"+userEmail+"','"+userName+"','"+userPw+"','"+userNumber+"')";
    con.query(q,(err,result,fields)=>{
        if(result && result.length!=0){
            console.log(result);
            return res.status(201).send(result);
        }
        else{
            return res.sendStatus(204);
         }     
    });
});

router.delete('/exit',(req,res,next)=>{
    const {userNo}=req.body;
    console.log(userNo);
    let q="delete from user where userNo ="+userNo;
    con.query(q,(err,result,fields)=>{
        return res.sendStatus(200);
    });
});

router.post('/meditotal',(req,res,next)=>{
    const {userNo}=req.body;
    let q="select c.categoryNo, (select count(*) from feel f where f.contentsNo in (select co.contentsNo from contents co where co.categoryNo = c.categoryNo) and userNo = '"+userNo+"') `count` from category = c";
    con.query(q,(err,result,fields)=>{
        if(result && result.length!=0){
            result.pop();
            console.log(result);
            return res.status(201).json(result);
        }
        else{
            return res.sendStatus(204);
         }  
    });
});

module.exports=router;