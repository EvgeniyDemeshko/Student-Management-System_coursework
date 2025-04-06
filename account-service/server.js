// константи або модуль

const express=require("express")
const app=express()
const cors=require("cors")
const port=process.env.port || 3005
const bodyParser=require("body-parser")
// створення сервера Node.js
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))

const controller=require("./controller/controller")
app.use(controller)

app.listen(port,(err)=>{
    if(err) throw err;
        console.log(`Server is running on port: ${port}`);

})
