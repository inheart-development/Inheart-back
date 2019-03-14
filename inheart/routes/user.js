const express=require('express');
const router=require('express').Router();
const mysql=require('mysql');
const con=require('../db/db');


// con.connect(function (err) {
//     if (err) throw err;
//     console.log('ok');
// });



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



module.exports=router;