const { Router } = require('express');
const express=require('express');

const router=express.Router()
router.get("/newworld",(req,res)=>{
    res.send("It's awesom ")
})




module.exports=router