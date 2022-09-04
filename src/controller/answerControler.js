const answerModel=require('../model/answerModel')
const userModel=require('../model/userModel')
const questionModel=require('../model/questionModel')
const { isValid } = require('../validator/validator')
const { default: mongoose } = require('mongoose')

const createAnswer=async(req,res)=>{
    try {
        const data = req.body
        if(!Object.keys(data).length){
            return res.status(400).send({status:false,message:"please provide the Answer's details to write Answer"})
        }
        let ansDM={
            answeredBy:{
                required:true,
                type:"ObjectId",
                ref:userModel,
                reqName:"userData"
            },
            questionId:{
                required:true,
                type:"ObjectId",
                ref:questionModel,
                reqName:"questionData"
            },
            text:{
                required:true
            }
        }

        for(let i in ansDM){
            if(ansDM[i].hasOwnProperty("required")){
                if(!data.hasOwnProperty(i))return res.status(400).send({status:false,message:"Plz provied the required field "+i})
                if(!isValid(data[i]))return res.status(400).send({status:false,message:"Plz provied "+i})
            }
            if(ansDM[i].hasOwnProperty("type")){
                if(!mongoose.isValidObjectId(data[i]))return res.status(400).send({status:false,message:"Plz provied valid "+i})
                req[ansDM[i]["reqName"]]=await ansDM[i]['ref'].findById({_id:data[i]})

                let source=req[ansDM[i]['reqName']]
                if(!source)return res.status(404).send({status:false,message:i+" not found!"})
                if(source.isDeleted)return res.status(404).send({status:false,message:i+" not found!"})
            }
        }
        
        data.isDeleted=false; data.deletedAt=null;

        const answerData=await answerModel.create(data)

        res.status(201).send({status:true,Answer:answerData})

    } catch (error) {
        res.status(500).send({status:false,message:error.message})
    }

}

const getAnsQuesById=async(req,res)=>{
    try{
    const questionId=req.params.questionId
    if(!questionId)return res.status(400).send({status:false,message:"Plz provied the questionid"})
    if(!mongoose.isValidObjectId(questionId))return res.status(400).send({status:false,message:"PLz provied the valid question id"})

    const questionData=await questionModel.findOne({_id:questionId,isDeleted:false}).select({description:1}).lean()
    if(!questionData)return res.status(404).send({status:false,message:"Question not found!"})

    const allAnswer=await answerModel.find({questionId,isDeleted:false}).select({text:1,_id:1,answeredBy:1,questionId:1})
    if(!allAnswer.length)return res.status(404).send({status:false,message:"no answer found the Question Q. "+questionData.description})
    questionData['answer']=allAnswer

    res.status(200).send({status:true,data:questionData})

    }catch(error){
        res.status(500).send({status:false,message:error.message})

    }
}

const answerUpadte=async(req,res)=>{
    try {
        const [data,answerId]=[req.body , req.params.answerId]
        if(!Object.keys(data).length)return res.status(400).send({status:false,message:"plz provide data to update answer"})
        if(!answerId)return res.status(400).send({status:false,message:"plz provide the answerId"})
        if(!mongoose.isValidObjectId(answerId))return res.status(400).send({status:false,message:"Plz Provide the valid answerId"})

        const answerCheck=await answerModel.findOne({_id:answerId,isDeleted:false})
        if(!answerCheck)return res.status(404).send({status:false,message:"answer not found!"})
        let {text}=data
        if(!data.hasOwnProperty("text"))return res.status(404).send({status:false,message:"You can update answer only by text"})
        if(!isValid(text))return res.status(404).send({status:false,message:"plz provide text"})
        answerCheck.text=`${text}`.trim()
        await answerCheck.save()
        res.status(200).send({status:true,data:answerCheck})


    } catch (error) {
        res.status(500).send({status:false,message:error.message})
        
    }
}

const deleteAnswer=async(req,res)=>{
    try{
    const answerId=req.params.answerId
    if(!answerId)return  res.status(400).send({status:false,message:"Plz provied the answerid"})
    if(!mongoose.isValidObjectId(answerId))return res.status(400).send({status:false,message:"PLz provied the valid answerId"})

    const answerData=await answerModel.findOneAndUpdate({_id:answerId,isDeleted:false},{isDeleted:true,deletedAt:Date()})
    if(!answerData)return res.status(404).send({status:false,message:"answer not found!"})
    
    res.status(200).send({status:true,message:"answer daleted successful! 😁👍"})
    }catch(error){
        res.status(500).send({status:false,message:error.message})
    }

}

module.exports={createAnswer,getAnsQuesById,answerUpadte,deleteAnswer}