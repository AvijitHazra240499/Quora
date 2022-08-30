const userModel=require("../model/userModel")
const jwt=require('jsonwebtoken')
const validator=require("../validator/validator")
const { default: mongoose } = require("mongoose")


const registerUser=async(req,res)=>{
    try{
        let data=req.body
         let{fname,lname,email,phone,password}=data
        
        if(!Object.keys(data).length){
            return res.status(400).send({status:false,message:"please provide the user's details to register"})
        }
        let arr=["fname","lname","email","phone","password"]
        let regex={"email":/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/}
        let msg={"email":" email is invali"}
        for(let i of arr){
            if(!data.hasOwnProperty(i)){return res.status(400).send({status:false,message:"Plz  provied the required field "+i})}
            if(!validator.isValid(data[i])) {return res.status(400).send({status:false,message:"Plz  provied "+i})}
            if(regex.hasOwnProperty(i) && !regex[i].test(data[i])){ return res.status(400).send({status:false,message:data[i]+msg[i]})}
        }
        const newUser=await userModel.create({fname,lname,email,phone,password,creditScore:0})


       res.status(201).send({status:true,userDtail:newUser})

    }catch(error){
        return res.status(500).send({Error:error.message})
    }
}

const loginUser=async(req,res)=>{
    let data=req.body
    let {email,password}=data
    if(!Object.keys(data).length){
        return res.status(400).send({status:false,message:"please provide the user's details to register"})
    }
    let arr=["email","password"]
        let regex={"email":/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/}
        let msg={"email":" email is invali"}
        for(let i of arr){
            if(!data.hasOwnProperty(i)){return res.status(400).send({status:false,message:"Plz  provied the required field "+i})}
            if(!validator.isValid(data[i])) {return res.status(400).send({status:false,message:"Plz  provied "+i})}
            if(regex.hasOwnProperty(i) && !regex[i].test(data[i])){ return res.status(400).send({status:false,message:data[i]+msg[i]})}
        }
    const searchUser=await userModel.findOne({email,password})
    if(!searchUser)return res.status(400).send({status:false,message:"email or password is incorrect"})
        const token=jwt.sign({userId:searchUser._id},"avi❤️devaitea")
    res.status(201).send({status:true,token})
}


const getUserDtail=async (req,res)=>{
    let userId=req.params.userId
    if(!mongoose.isValidObjectId(userId)){return res.status(400).send({status:false,message:"plz provied valid userId "})}
    const searchUser=await userModel.findById(userId)
    if(!searchUser){return res.status(404).send({status:false,message:"user not found! "})}
    res.status(200).send({status:true,userDtail:searchUser})

}

const userUpdate={}
module.exports={registerUser,loginUser,getUserDtail}
