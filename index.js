const express = require("express");
const morgan = require("morgan");
const { rateLimit } = require('express-rate-limit')
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require('xss-clean')
const hpp = require('hpp')


const app = express();

// DATA Size LImiting and parsing incoming JSON requests and puting the parsed data in req.body.
app.use(express.json({limit: "10kb"}))



// DATA Sanitization against NoSQL query injections
app.use(mongoSanitize())


// DATA Sanitization against Cross Site Scripting (XSS)
app.use(xss())

// Prevent Parameter Pollution
app.use(hpp({
    whitelist: ["duration","difficulty","maxGroupSize","price","ratingsAverage","ratingsQuantity"]
}))


// SET PROPERITES In HEADER - SECURE THE HEADER
app.use(helmet())

const limiter = rateLimit({
    max: 400,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP address, please try again in an hour",
})


// RATE LIMIT
app.use('/api',limiter)

// GLOBAL MIDDLEWARES

// if(process.env.NODE_ENV == "development"){
    app.use(morgan("dev"))
// }


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