const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json())

// if(process.env.NODE_ENV === "development"){
//     app.use(morgan("dev"))
// }
app.use(morgan("dev"))


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

module.exports = app;