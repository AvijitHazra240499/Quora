require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const route = require('./route')
const port = process.env.SUMAN || 3000
const dbUrl =process.env.URL_mongoDB

app.use(express.json())

mongoose.connect(dbUrl, {useNewUrlParser: true})
.then(() => console.log('mongoose is connected'))
.catch(err => console.log(err.message))

app.use(route)

app.listen(port, () =>{
    console.log(`Express app ruuning on PORT: ${port}`)
})