const express = require("express");
const morgan = require("morgan");



const app = express();

app.use(express.json())

if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}


const AppError = require('./Utils/appError')
const GlobalErrorHandler = require('./controllers/errorController')

const nftsRouter = require('./routes/nftsRoute')
const usersRouter = require('./routes/usersRoute')

// Serving Template Demo
app.use(express.static(`${__dirname}/nft-data/img`))

// CUStom Middleware
app.use((req, res, next) => {
    console.log("Ok")
    next()
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
})

// middleware for routing
app.use('/api/v1/nfts', nftsRouter)
app.use('/api/v1/users', usersRouter)

app.all("*",(req,res, next)=>{
    // res.status(404).json({
    //     status: "failed",
    //     message: `Can't find ${req.originalUrl} on this server`
    // })

    // const err = new Error(`Can't find ${req.originalUrl} on this server`)
    // err.status = 'failed'
    // err.statusCode = 404

    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})
// Global Error Handler
app.use(GlobalErrorHandler)

module.exports = app;