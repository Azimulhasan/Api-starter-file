const AppError = require("../Utils/appError")

const sendErrorDev = (err,res)=>[
    res.status(err.statusCode).json({
        status: err.status,
        message:err.message,
        error: err,
        stack: err.stack,
    })
]
const sendErrorPro = (err,res)=>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    } else{
        res.status(500).json({
            status: "error",
            message: "Something went wrong"
        })
    }
    
}
const handleCastError = (err)=>{
    const message = `Invalid ${err.name}: ${err.value}`
    return new AppError(message,400)
}
const handleDuplicateFieldsBD = (err) =>{
    const value =  err.errmsg.match(/(?<=")(?:\\.|[^"\\])*(?=")/)
    const message= `Duplicate field values '${value}', Please use another value`
    return new AppError(message,409)
}
const handleValidationError = (err)=>{
    const errors = Object.values(err.errors).map((el)=> el.message)
    const message = `Invalid in Data. ${errors.join(". ")}`
    return new AppError(message,400)
}

module.exports = (err, req, res, next)=>{
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error"

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,res)
    } else if(process.env.NODE_ENV === 'production'){
        let copyErr = {...err};
        if(copyErr.name === 'CastError'){
            copyErr = handleCastError(copyErr)
            sendErrorPro(copyErr,res)
        }else if(copyErr.code === 11000){
            copyErr = handleDuplicateFieldsBD(copyErr)
            sendErrorPro(copyErr,res)
        }else if(copyErr.name === 'ValidationError'){
            copyErr = handleValidationError(copyErr)
            sendErrorPro(copyErr,res)
        }else{
            sendErrorPro(err,res)
        }
        ValidationError
        
    }

    next()
}