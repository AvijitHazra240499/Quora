const questionModel=require("../model/questionModel")
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



module.exports={questionCreate}