const express=require('express');
const router=require('express').Router();
const mysql=require('mysql');
const con=require('../db/db');



router.get('/list',(req,res,next)=>{
    const {}=req.body;
    let q="select * from faq;";
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

module.exports=router;