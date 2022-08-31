const { Router } = require('express');
const express=require('express');
const {registerUser,loginUser,getUserDtail,userUpdate}=require('./controller/userController')
const router=express.Router()

router.get("/newworld",(req,res)=>{
    res.send("It's awesom ")
})

// ------------------------------------User------------------------------------------------------
router.post("/user",registerUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",getUserDtail)
router.put("/user/:userId/profile",userUpdate)


module.exports=router