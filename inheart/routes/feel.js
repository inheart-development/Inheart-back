const express=require('express');
const router=require('express').Router();
const multer=reuiqre('multer');
const con=require('../db/db');
const path=require('path');

router.post('/listfeel',(req,res,next)=>{
    const {userNo,feelType}=req.body;
    
});

module.exports=router;