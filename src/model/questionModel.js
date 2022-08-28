const mongoose=require("mongoose")

const questionSchema=new mongoose.Schema({

        description: {type:string,required:true} ,
        tag: [String],
        askedBy:{ type:mongoose.Schema.Types.ObjectId(),
        trim:true,
        ref:"user"},
        deletedAt: {type:Date}, 
        isDeleted: {type:boolean, default: false},
       
     
},{timestamps:true})

module.exports=mongoose.model("question",questionSchema)