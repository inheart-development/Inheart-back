const express=require('express');
const router=require('express').Router();
const multer=reuiqre('multer');
const con=require('../db/db');
const path=require('path');

router.post('/listfeel',(req,res,next)=>{
    const {userNo,feelType}=req.body;
    
const mysql=require('mysql');
const con=require('../db/db');


router.post('/onefeel',(req,res,next)=>{
    const {feelNo}=req.body;
    let q="select * from feel where feelNo = '"+feelNo+"';";

    console.log(q)
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

router.post('/listfeel',(req,res,next)=>{
    const {userNo,feelType}=req.body;
    let q="select * from feel where userNo = '"+userNo+"' and feelType like '%"+feelType+"%' ;";

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

router.post('/insertfeel',(req,res,next)=>{
    const {userNo,contentsNo,feelImage,feelText,feelTime,feelType}=req.body;
    let q="insert into feel values('0','"+userNo+"','"+contentsNo+"','"+new Date().toFormat("YYYY-MM-DD HH24:MI:SS")+"','"+feelImage+"image경로 하자','"+feelText+"','"+feelTime+"','"+feelType+"');";
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

module.exports=router;