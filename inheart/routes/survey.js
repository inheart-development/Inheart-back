const express=require('express');
const router=require('express').Router();
const mysql=require('mysql');
const con=require('../db/db');


router.post('/surveylist',(req,res,next)=>{
    const {userNo}=req.body;
    let q="select * from survey where userNo = '"+userNo+"';";

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

router.post('/initsurvey',(req,res,next)=>{
    const {userNo,survey_1,survey_2,survey_3,survey_4,survey_5,survey_6,survey_7,survey_8}=req.body;

    let q="insert into survey values('0','"+userNo+"','"+new Date().toFormat("YYYY-MM-DD HH24:MI:SS")+"',"+survey_1+","+survey_2+","+survey_3+","+survey_4+","+survey_5+","+survey_6+","+survey_7+","+survey_8+")";
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