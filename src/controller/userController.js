const userModel=require("../model/userModel")
const jwt=require('jsonwebtoken')
const validator=require("../validator/validator")
const { default: mongoose } = require("mongoose")
const bcrypt=require('bcrypt')

const registerUser=async(req,res)=>{
    try{
        let data=req.body
         let{fname,lname,email,phone,password}=data
        
        if(!Object.keys(data).length){
            return res.status(400).send({status:false,message:"please provide the user's details to register"})
        }
        let arr=["fname","lname","email","phone","password"]
        let regex={"email":/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/,"phone":/^(\+\d{1,3}[- ]?)?\d{10}$/,"password":/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/}
        let msg={"email":" email is invalid","phone":" phone is invalid,It should contain 10 number and number should start from 7 to 9","password":"password is invalid password,password must contain atleast one lower and upper case and alpha numeric charecter with the min length of 8 to max length of 15 "}
        let unique={"email":userModel,"phone":userModel}
        for(let i of arr){
            if(!data.hasOwnProperty(i)){return res.status(400).send({status:false,message:"Plz  provied the required field "+i})}
            if(!validator.isValid(data[i])) {return res.status(400).send({status:false,message:"Plz  provied "+i})}
            if(regex.hasOwnProperty(i) && !regex[i].test(data[i])){ return res.status(400).send({status:false,message:data[i]+msg[i]})}
            if(unique.hasOwnProperty(i)){
                let varUnique= await unique[i]['findOne']({[i]:data[i]})
                if(varUnique)return res.status(400).send({status:false,message:i+" is already resistered"})
            }
        }
        let salt=10
        const encryptedpassword=await bcrypt.hash(password,salt)
        password=encryptedpassword
        const newUser=await userModel.create({fname,lname,email,phone,password,creditScore:0})


       res.status(201).send({status:true,userDtail:newUser})

    }catch(error){
        return res.status(500).send({Error:error.message})
    }
}

const loginUser=async(req,res)=>{
    try {
        
    let data=req.body
    let {email,password}=data
    if(!Object.keys(data).length){
        return res.status(400).send({status:false,message:"please provide the user's details to register"})
    }
    let arr=["email","password"]
        let regex={"email":/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/,"password":/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/}
        let msg={"email":" email is invalid","password":"password is invalid password,password must contain atleast one lower and upper case and alpha numeric charecter with the min length of 8 to max length of 15 "}
        for(let i of arr){
            if(!data.hasOwnProperty(i)){return res.status(400).send({status:false,message:"Plz  provied the required field "+i})}
            if(!validator.isValid(data[i])) {return res.status(400).send({status:false,message:"Plz  provied "+i})}
            if(regex.hasOwnProperty(i) && !regex[i].test(data[i])){ return res.status(400).send({status:false,message:data[i]+msg[i]})}
        }
    const searchUser=await userModel.findOne({email})
    if(!searchUser)return res.status(400).send({status:false,message:"login failed email id is incorrect"})
    
    let hashPassword=searchUser.password
    const encryptedpassword=await bcrypt.compare(password,hashPassword)
    if(!encryptedpassword) return res.status(400).send({status:false,message:"login failed password id is incorrect"})
        const token=jwt.sign({userId:searchUser._id},"avi❤️devaitea")
    return res.status(201).send({status:true,token})
}
catch (error) {
    return res.status(500).send({status:false,Error:error.message}) 
}
}

const getUserDtail=async (req,res)=>{
    try {
    let userId=req.params.userId
    if(!mongoose.isValidObjectId(userId)){return res.status(400).send({status:false,message:"plz provied valid userId "})}
    const searchUser=await userModel.findById(userId)
    if(!searchUser){return res.status(404).send({status:false,message:"user not found! "})}
    res.status(200).send({status:true,userDtail:searchUser})
} catch (error) {
    return res.status(500).send({status:false,Error:err.message})     
}
}

const userUpdate=async (req,res)=>{
try {
    let userId=req.params.userId
    let data=req.body
    if(!mongoose.isValidObjectId(userId)){return res.status(400).send({status:false,message:"plz provied valid userId "})}
    if(!Object.keys(data).length){
        return res.status(400).send({status:false,message:"please provide the user's details to register"})
    }

    let arr=["fname","lname","email","phone","password"]

    let regex={email:/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/,
                phone:/^(\+\d{1,3}[- ]?)?\d{10}$/,
                password:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/
            }

    let regex_msg={email:" email is invalid",
                    phone:" phone is invalid,It should contain 10 number and number should start from 7 to 9",
                    password:"password is invalid password,password must contain atleast one lower and upper case and alpha numeric charecter with the min length of 8 to max length of 15 "
                    }

    let unique={"email":userModel,"phone":userModel}

    for(let i of arr){
        if(data.hasOwnProperty(i)){
        if(!validator.isValid(data[i])) {return res.status(400).send({status:false,message:"Plz  provied "+i})}
        if(regex.hasOwnProperty(i) && !regex[i].test(data[i])){ return res.status(400).send({status:false,message:data[i]+regex_msg[i]})}
        if(unique.hasOwnProperty(i)){
            let varUnique= await unique[i]['findOne']({[i]:data[i]})
            if(varUnique)return res.status(400).send({status:false,message:i+" is already resistered"})
        }
    }
    }
    const {fname,lname,email,phone,password}=data
    const userUpdateData=await userModel.findByIdAndUpdate(userId,{fname,lname,email,phone,password},{new:true})
    res.status(200).send({status:true,data:userUpdateData})

} catch (error) {
    return res.status(500).send({status:false,Error:error.message})
}

}
module.exports={registerUser,loginUser,getUserDtail,userUpdate}
