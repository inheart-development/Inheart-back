const express=require('express');
const router=require('express').Router();
const mysql=require('mysql');
const con=require('../db/db');

router.post('/noticelist',(req,res,next)=>{
    const {userNo}=req.body;
    let q="select * from notice where userNo = '"+userNo+"';";

    console.log(q)
    con.query(q,(err,result,fields)=>{
        if(result && result.length!=0){
            console.log(result);
            return res.status(200).json(result);
            
        }
        else{
            return res.sendStatus(204);
        
        }
    });
});

router.post('/initnotice',(req,res,next)=>{
    const {userNo,noticeTime,noticeBool}=req.body;
    let q="insert into notice values('0','"+userNo+"','"+noticeTime+"',"+noticeBool+");";
    console.log(q)
    con.query(q,(err,result,fields)=>{

        if (err){
            return res.sendStatus(204);
            throw err;
        } 

        // if there is no error, you have the result
        console.log(result);
        return res.sendStatus(201)

    });
});


router.post('/noticebool',(req,res,next)=>{
    const {noticeBool,noticeNo}=req.body;
    let q="update notice set noticeBool = "+noticeBool+" where noticeNo = "+noticeNo+";";

    console.log(q)
    con.query(q,(err,result,fields)=>{
        if(result && result.length!=0){
            console.log(result);
            return res.sendstatus(200);
            
        }
        else{
            return res.sendStatus(204);
        
        }
    });
});


module.exports=router;