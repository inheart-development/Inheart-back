const express=require('express');
const router=require('express').Router();
const mysql=require('mysql');
const con=require('../db/db');

router.post('/starlist',(req,res,next)=>{
    const {userNo,categoryNo}=req.body;
    let q="select c.* from contents c where c.categoryNo = '"+categoryNo+"' and c.contentsNo in (select s.contentsNo from star s where s.userNo = '"+userNo+"') order by contentsIndex; ";
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