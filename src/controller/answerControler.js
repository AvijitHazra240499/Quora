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
        // res.send('all good 👍😁')

    } catch (error) {
        res.status(500).send({status:false,message:error.message})
    }

}

module.exports={createAnswer}