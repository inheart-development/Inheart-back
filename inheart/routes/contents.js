const express=require('express');
const router=require('express').Router();
const mysql=require('mysql');
const con=require('../db/db');

router.post('/catestarlist',(req,res,next)=>{
    const {categoryNo,userNo}=req.body;
    let q="select c.*, (if(c.contentsNo in(select s.contentsNo  from star s where userNo = '"+userNo+"') ,True,False)) contentsStar from contents c where c.categoryNo = '"+categoryNo+"' order by contentsIndex;";
    console.log(q)
    con.query(q,(err,result,fields)=>{
            console.log(result);
            res.json(result);
    });
});

router.post('/catelist',(req,res,next)=>{
    const {categoryNo}=req.body;
    let q="select * from contents where categoryNo = '"+categoryNo+"' order by contentsIndex;";
    console.log(q)
    con.query(q,(err,result,fields)=>{
            console.log(result);
            res.json(result);
    });
});

router.post('/content',(req,res,next)=>{
    const {contentsNo}=req.body;
    let q="select * from contents where contentsNo = '"+contentsNo+"' order by contentsIndex;";
    console.log(q)
    con.query(q,(err,result,fields)=>{
            console.log(result);
            res.json(result);
    });
});

module.exports=router;