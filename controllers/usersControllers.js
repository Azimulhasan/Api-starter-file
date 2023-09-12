const AppError = require("../Utils/appError")
const catchAsync = require("../Utils/catchAsync")
const User = require("../models/userModol")

const filterObj = (obj, ...allowedFields)=>{
    const newObj = {}
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj
}

exports.updateMe =catchAsync(async (req, res, next) => {

    // Create an error if USER UPDATING PASSWORD
    if(req.body.password || req.body.passwordConfirm){
        return next( new AppError('THis route is not for password Update, Please use /UpdateMyPassword route.',400))
    }

    // UPDATE USER DATA
    const filtererBody = filterObj(req.body, "name","email")  
    const updateUser = await User.findByIdAndUpdate(req.user.id, filtererBody,{
        new: true,
        runValidators: true,
    })

    // user.name = "fFIDJFDJFD"
    // await user.save()

    res.status(200).json({
        status: "Success",
        data: {
            user: updateUser,
        }
    })
})

// DELETE SELF ACCOUnt
exports.deleteMe = catchAsync(async (req, res, next)=>{
    const user = await User.findByIdAndUpdate(req.user.id, {active: false}).exec()

    res
        .status(204)
        .json({
            status: "success",
            data: {
                user: user,
            },
        })
})


// Users Data
exports.getAllUsers = catchAsync(async(req, res, next) => {
    
    const users = await User.find()
    res
        .status(200)
        .json({
            status: "success",
            resquestTime: req.requestTime, 
            results: users.length, 
            data: {
                users
            }
        })
    }
)

exports.createUser = (req, res) => {
    res
        .status(500)
        .json({status: "success", message: "Internal Server Error"})
}

exports.getSingleUser = (req, res) => {
    res
        .status(500)
        .json({status: "success", message: "Internal Server Error"})
}

exports.deleteUser = (req, res) => {
    res
        .status(500)
        .json({status: "success", message: "Internal Server Error"})
}

exports.updateUser = (req, res) => {
    res
        .status(500)
        .json({status: "success", message: "Internal Server Error"})
}