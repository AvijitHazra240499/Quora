const { Router } = require('express');
const {registerUser,loginUser,getUserDtail,userUpdate}=require('./controller/userController')
const {questionCreate}=require('./controller/questionController')
const {createAnswer}=require('./controller/answerControler')
const router=Router()

router.get("/newworld",(req,res)=>{
    res.send("It's awesom ")
})

// ------------------------------------User------------------------------------------------------
router.post("/user",registerUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",getUserDtail)
router.put("/user/:userId/profile",userUpdate)


// ---------------------------------------question API-----------------------------------------------
router.post("/question",questionCreate)
router.get("/questions",registerUser)
router.get("/questions/:questionId",registerUser)
router.put("/questions/:questionId",registerUser)
router.delete("/questions/:questionId",registerUser)


//-----------------------------------------answer API------------------------------------------------
router.post("/answer",createAnswer)
router.post("/questions/:questionId/answer",questionCreate)
router.post("/answer/:answerId",questionCreate)
router.post("/answers/:answerId",questionCreate)



module.exports=router