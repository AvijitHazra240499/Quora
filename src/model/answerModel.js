

const mongoose=require("mongoose")
const ObjectId=mongoose.Schema.Types.ObjectId()

const answerSchema=new mongoose.Schema({


 answeredBy: {type:ObjectId, refs :"User", required:true},
 text: {type:string, required:true},
 questionId: {type:ObjectId, refs:"question", required:true},
 isDeleted : {type:Boolean,default :false},

},{timestamps:true})
module.exports=mongoose.model("answer",answerSchema)