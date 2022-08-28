// const express=require("express")
// const mongoose=require("mongoose")
// const route=require('./route')
// //require('dotenv').config()

// express().use(express.json())//bodyparser
// express().use(express.urlencoded({extended:true}))

// mongoose.connect(process.env.mongoDB_URL,{useNewUrlParser:true})
// .then(()=>console.log("mongoose is connected"))
// .catch(err=>console.log(err.message))

// express().use(route)


// express().listen(process.env.PORT,()=>{
//     console.log(`server runnig on ${process.env.PORT}`)
// })



// express().listen(process.env.PORT||3000,()=>{
//     console.log("Express app is running on PORT " +(process.env.PORT||3000))
// })
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const route = require('./route')
const port = process.env.PORT || 3000
const dbUrl = 'mongodb+srv://avijithazra12:Avijit16@cluster0.b7ob9.mongodb.net/Quora-DB?retryWrites=true&w=majority'

app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect(dbUrl, {useNewUrlParser: true})
.then(() => console.log('mongoose is connected'))
.catch(err => console.log(err.message))

app.use(route)

app.listen(port, () =>{
    console.log(`Express app ruuning on PORT: ${port}`)
})