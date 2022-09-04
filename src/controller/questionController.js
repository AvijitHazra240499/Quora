const questionModel=require("../model/questionModel")
const answerModel=require('../model/answerModel')
const validator=require('../validator/validator')
const userModel=require('../model/userModel')
const mongoose=require('mongoose')




const questionCreate=async (req,res)=>{
    try {
        const data=req.body
        if(!Object.keys(data).length){
            return res.status(400).send({status:false,message:"please provide the Question's details to ask Question"})
        }
    
        let verifyData={}

        let arr=["description","tag","askedBy"]
        let required={"description":"required","askedBy":"required"}
    
        // let regex={}
        // let regex_msg={}
    
        for(let i of arr){
            if(required.hasOwnProperty(i) && !data.hasOwnProperty(i)){return res.status(400).send({status:false,message:"Plz  provied the required field "+i})}
            if(data.hasOwnProperty(i)){
            if(!validator.isValid(data[i])) {return res.status(400).send({status:false,message:"Plz  provied "+i})}
            // if(regex.hasOwnProperty(i) && !regex[i].test(data[i])){ return res.status(400).send({status:false,message:data[i]+regex_msg[i]})} 
            verifyData[i]=data[i]
        }
    }
    if(!mongoose.isValidObjectId(verifyData["askedBy"])) return res.status(400).send({status:true,message:"askedBy is not valid userId"})
    let searchUser=await userModel.findById(data.askedBy)
    if(!searchUser)return res.status(404).send({status:true,message:"user not found!"})

    if(data.hasOwnProperty("tag")){
        if(Array.isArray(data.tag)){
            data.tag=data.tag.filter(x=>`${x}`.trim())
            // let filterArr=[]
            // data.tag.forEach(e => {
            //     e=`${e}`.trim()
            //     if(e){
            //         filterArr.push(e)  
            //     }
            // });
            // data.tag=filterArr
        }else{
            data.tag=data.tag.split(",").filter(x=>`${x}`.trim())
        }
        verifyData.tag=data.tag.map(x=>`${x}`.trim())
    }
    
    if(searchUser.creditScore<100)return res.status(400).send({status:false,message:"You have not enough creditscore for asking a question"})

    const createQuestion=await questionModel.create(verifyData)

    searchUser.creditScore=searchUser.creditScore-100
    await searchUser.save()

    res.status(201).send({status:true,Question:createQuestion})

    } catch (error) {
        res.status(500).send({status:false,message:error.message})
    }
}

const getQuestion=async(req,res)=>{
    const data=req.query
    if(!Object.keys(data).length){
        let allQuestion=await questionModel.find({isDeleted:false})
        return res.status(200).send({status:true,Questions:allQuestion})
    }
    let {description,tag,askedBy}=data

    let filter={isDeleted:false}

    if(data.hasOwnProperty('description')){
        if(validator.isValid(description)){
            filter["description"]=new RegExp(description, 'i');
        }
    }
    if(data.hasOwnProperty("tag")){
        if(validator.isValid(tag)){
            if(tag.charAt(0)=="[" && tag.slice(-1)==']'){ /// eg:"[egg,chiken]"
                data.tag=data.tag.slice(1,-1)
            }
                // data.tag=data.tag.filter(x=>`${x}`.trim())
                data.tag=data.tag.split(",").filter(x=>`${x}`.trim())
            
            data.tag=data.tag.map(x=>`${x}`.trim())

            filter["tag"]={$in:data.tag}
        }
    }
    if(data.hasOwnProperty("askedBy")){
        if(validator.isValid(askedBy)){
            if(!mongoose.isValidObjectId(askedBy)){return res.status(400).send({status:false,message:"plz provied correct askedBy Id"})}
            req['userData']=await userModel.findById(askedBy)
            if(!req['userData'])return res.status(404).send({status:false,message:"askedBy user not available 👽"})
            filter["askedBy"]=askedBy
        }
    }

    const searchQuestion=await questionModel.find(filter)
    if(!searchQuestion.length)return res.status(404).send({status:false,message:"No Question found 😱"})
    res.status(200).send({status:true,Question:searchQuestion})

}

const getQuestionById=async(req,res)=>{
    try{
    const QuestionId=req.params.questionId
    if(!mongoose.isValidObjectId(QuestionId))return res.status(400).send({status:false,message:"plz provied correct questionId"})
    const questionData=await questionModel.findOne({_id:QuestionId,isDeleted:false}).select({isDeleted:0,__v:0,deletedAt:0}).lean()
    if(!questionData)return res.status(404).send({status:false,message:"question not found!"})
    let allAnswer=await answerModel.find({questionId:QuestionId,isDeleted:false}).select({isDeleted:0,__v:0,deletedAt:0})
    let answers=[]
    // if(allAnswer.length==1)answers=allAnswer[0].text
    if(!allAnswer.length)allAnswer=answers="no answer present in this question"
    else if(allAnswer.length>=1){
        for(let i of allAnswer){
            answers.push(i.text)
        }
    }
    // questionData['answer']=allAnswer
    res.status(200).send({status:true,Question:questionData.description,Answer:answers,QD:questionData,ansD:allAnswer})
    }catch(error){
        res.status(500).send({status:false,message:error.message})
    }
}

const questionUpdate=async(req,res)=>{
    try {
        const [data,questionId]=[req.body , req.params.questionId]
        if(!Object.keys(data).length)return res.status(400).send({status:false,message:"plz provide data to update question"})
        if(!questionId)return res.status(400).send({status:false,message:"plz provide the questionid"})
        if(!mongoose.isValidObjectId(questionId))return res.status(400).send({status:false,message:"Plz Provide the valid QuestionId"})
        
        const quesCheck=await questionModel.findOne({_id:questionId,isDeleted:false})
        if(!quesCheck)return res.status(404).send({status:false,message:"Question not found!"})
        let {tag,description}=data
        if(!tag && !description)return res.status(400).send({status:false,message:"You can update your question with only tag and text"})

        if(data.hasOwnProperty("tag")){
            if(!validator.isValid(tag))return res.status(400).send({status:false,message:"Plz provide the tag"})
            if(Array.isArray(tag)){
                tag=tag.filter(x=>`${x}`.trim() && !quesCheck.tag.includes(x.trim()))
            }else{
                tag=tag.split(",").filter(x=>`${x}`.trim() && !quesCheck.tag.includes(x.trim()))
            }
            if(tag.length){
            tag=tag.map(x=>`${x}`.trim())
            // console.log(quesCheck.tag)
            quesCheck.tag.push(...tag)
            }
        }

        if(data.hasOwnProperty("description")){
            if(!validator.isValid(description))return res.status(400).send({status:false,message:"Plz provide the test"})
            quesCheck.description=description
        }

        await quesCheck.save()

        res.status(200).send({status:true,data:quesCheck})
        

    } catch (error) {
        res.status(500).send({status:false,message:error.message})
        
    }
}

const daleteQuestion=async(req,res)=>{
    try {
        const questionId=req.params.questionId
        if(!questionId)return res.status(400).send({status:false,message:"Plz Provied the questionId"})
        if(!mongoose.isValidObjectId(questionId))return res.status(400).send({status:false,message:"Plz provied the valid questionId"})
        const questionData=await questionModel.findOneAndUpdate({_id:questionId,isDeleted:false},{isDeleted:true,deletedAt:Date()})
        if(!questionData)return res.status(404).send({status:false,message:"question not found!"})
        await answerModel.updateMany({questionId,isDeleted:false},{isDeleted:true,deletedAt:Date()})
        res.status(200).send({status:true,message:"Question deleted successful! 👍😁"})

    } catch (error) {
        res.status(500).send({status:false,message:error.message})
        
    }
}
module.exports={questionCreate,getQuestion,getQuestionById,questionUpdate,daleteQuestion}