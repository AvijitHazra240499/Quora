const { Router } = require('express');
const {registerUser,loginUser,getUserDtail,userUpdate}=require('./controller/userController')
const {questionCreate,getQuestion,getQuestionById,questionUpdate,daleteQuestion}=require('./controller/questionController')
const {createAnswer,getAnsQuesById,answerUpadte,deleteAnswer}=require('./controller/answerControler')
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
router.get("/questions",getQuestion)
router.get("/questions/:questionId",getQuestionById)
router.put("/questions/:questionId",questionUpdate)
router.delete("/questions/:questionId",daleteQuestion)


//-----------------------------------------answer API------------------------------------------------
router.post("/answer",createAnswer)
router.get("/questions/:questionId/answer",getAnsQuesById)
router.put("/answer/:answerId",answerUpadte)
router.delete("/answers/:answerId",deleteAnswer)



module.exports=router