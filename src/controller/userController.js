// const userModel=require("../model/userModel")
const validator=require("../validator/validator")


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
            if(regex.hasOwnProperty(i) && !regex[i].test(data[i])){ return res.status(400).send({status:false,message:i+msg[i]})}
        }
       res.send("all runs fine!👌😍")

    }catch(error){
        return res.status(500).send({Error:error.message})
    }
}

module.exports={registerUser}
