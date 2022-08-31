

const mongoose=require("mongoose")
const ObjectId=mongoose.Schema.Types.ObjectId

const answerSchema=new mongoose.Schema({


 answeredBy: {type:ObjectId, ref :"User", required:true},
 questionId: {type:ObjectId, ref:"question", required:true},
 text: {type:String, required:true},
 isDeleted : {type:Boolean,default :false},
 deletedAt:{type:Date,default:null}

},{timestamps:true})
module.exports=mongoose.model("answer",answerSchema)