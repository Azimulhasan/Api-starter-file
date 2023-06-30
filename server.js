const app = require("./index")

const dotenv = require('dotenv')
dotenv.config({path: "./config.env"})

const mongoose = require("mongoose")


const DB = process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD)

//Mangoose connection 
mongoose.connect(
    DB,{
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser:true
    }
).then((con)=>{
    console.log(con.connection)
    console.log("DB connection was successful ")
})


// console.log(process.env)
// console.log(app.get("env"))




const port =  process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`App running on port ${port} ...`)
}) 
