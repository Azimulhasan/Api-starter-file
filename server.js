const app = require("./index")

const dotenv = require('dotenv')
dotenv.config({path: "./config.env"})

const mongoose = require("mongoose")


const DB = process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD)

//Mangoose connection 
mongoose.connect(
    DB,{
        useCreateIndex: true ,
        useFindAndModify: false,
        useNewUrlParser:true
    }
).then((con)=>{
    console.log("DB connection was successful ")
})


// console.log(process.env)
// console.log(app.get("env"))




// const testNFT = new NFT({
//     name: "Blue World",
//     rating: 3.2,
//     price: 32
// })

// testNFT.save().then((docNFT)=>{
//     console.log(docNFT)
// }).catch(error=>{
//     console.log(error)
// })

const port =  process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`App running on port ${port} ...`)
}) 
