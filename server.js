const app = require("./index")
const dotenv = require('dotenv')
const mongoose = require("mongoose")



process.on('uncaughtException', (err)=>{
    console.log(err.name, err.message)
    console.log('UncaughtException shutting down the applications')
    process.exit(1)
})

dotenv.config({path: "./config.env"})
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
const server = app.listen(port, ()=>{
    console.log(`App running on port ${port} ...`)
}) 


process.on("unhandledRejection", (err)=>{
    console.log(err.name, err.message, err.stack)
    console.log('UnhandledError shutting down the applications')
    server.close()
    process.exit(1)

})


