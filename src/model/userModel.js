const mongoose=require("mongoose")

const userSchema=new mongoose.Schema(
{ 
    fname: {type:string, required:true,trim:true},
    lname: {type:string, required:true,trim:true},
    email: {type:string, required:true, unique:true,trim:true,lowercase:true},
    phone: {type:string, required:true, unique:true, trim:true}, 
    password: {type:string, required:true,trim:true}, // encrypted password
    creditScore: {type:Number, required:true,trim:true},
    
  },{timestamps:true})

  module.exports=mongoose.model("user",userSchema)
 