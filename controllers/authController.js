const { promisify} = require('util')
const User = require("../models/userModol");
const crypto = require('crypto')
const AppError = require("../Utils/appError");
const catchAsync = require('../Utils/catchAsync')
const jwt = require('jsonwebtoken');
const sendEmail = require('../Utils/email');
const { error } = require('console');


// Create Token
const signToken = (id) =>{
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res) =>{
    const token = signToken(user.id)

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIR_IN * 24 * 60 * 60 * 1000
        ),
        // for if http request is https secure only
        // secure: true, 
        httpOnly: true,
    }

    if(process.env.NODE_ENV == 'production') cookieOptions.secure = true;
     ("jwt",token,cookieOptions)
    
    // Hiding user password
    user.password = undefined
    
    res.status(statusCode).json({
        status:"Success",
        token,
        data: {
            user: user,
        }
    })
}

// Sign in
exports.signup = catchAsync(async (req, res, next) =>{
    // const newUser = await User.create(req.body)
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    
    createSendToken(newUser, 201, res)
})

exports.login = catchAsync(async(req, res, next) => {

    const {email, password} = req.body;
    if(!email || !password){
       return next(new AppError('Please provide Email and Password',400))
    }
    const user = await User.findOne({email}).select("+password")
    
    if(!user || !(await user.correctPassword(password,user.password))){
        return next(new AppError('Incorrect email or password', 401))
    }

    createSendToken(user, 201, res)
}
)


// Protecting or abstracting data from unauthorised access
exports.protect = catchAsync(async(req, res, next)=>{
    
    let token;

    // Check for the token
    // console.log(req.headers.authorization)
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new AppError('You need to login first to access this.',401))
    }
    // VERIFYING VALIDITY OF THE TOKEN
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // Check if User Exists or not
    const currentUser = await User.findOne({"_id":decoded.id})
    
    if(!currentUser){
        return next(new AppError('The User does not exist',401))
    }

    // Password Change functionality
    if(currentUser.changePasswordAfter(decoded.iat)){
        return next(new AppError('The User has changed the password', 401))
    }

    req.user = currentUser

    // User will have access to the protected route
    next()
})

exports.restrictTo = (...roles) =>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have the access to perform this action',403))
        }
        next()
    }
}

// FOrget Password Functionality
exports.forgotPassword = catchAsync(async(req, res, next) =>{
    // Validation of Get using email

    // Get the user by checking with email
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return next(new AppError('There is no User with this email',404))
    }

    // Create a random token
    const resetToken = user.createPasswordResetToken()
    await user.save({validateBeforeSave: false})


    // Send Email back to User
    const resetURL = `${req.protocol}://${req.get("host")}//api/v1/user/resetPassword/${resetToken}`
    const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}. \n If you didn't forget your password, please ignore this email`
    
    try {
        
        await sendEmail({
            email: user.email,
            subject: "Your Password reset token (Valid for 10 mins))",
            message,
        })
        res.status(200).json({
            status: "success",
            message: "Token sent to email"
        })

    } catch (error) {
        user.passwordResetToken = undefined
        user.passwordResetToken = undefined
        await user.save({validateBeforeSave: false})

        return next(new AppError('There was an error sending the email, Try again later', 500))
    }

    
})


// simply testing something
// exports.hello = (req, res, next)=>{
//     res.status(200).json({
//         status: "success",
//         message: "hello",
//     })
//     next()
// }

// Reset Password Functionality
exports.resetPassword = async(req, res, next) =>{
    
    // GET user based on the token
    const hashedTOken = crypto.createHash('sha256').update(req.params.token).digest("hex")

    const user = await User.findOne({passwordResetToken: hashedTOken, passwordResetExpires: {$gt: Date.now()}})

    // If the token has expired, and there is user, set the new password

    if(!user){
        return next(new AppError("Token is invalid or has expired", 400))
    }


    // Update the changed password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    // try {
    //     await user.save()
    // } catch (error) {
    //     return next(error)
    // }
    await user.save().catch(error=> next(error))


    // Send Response, log the user in, and send JWT 
    createSendToken(user, 201, res)

}


// UPDATING USER PASSWORD

exports.updatePassword = catchAsync( async (req, res, next) =>{
    
    // GET USER FROM THE COLLECTION OF USERS
    const user = await User.findById(req.user.id).select('+password')
    
    // CHECK IF THE POSTED CURRENT PASSWORD IS CORRECT
    if(!(await user.correctPassword(req.body.currentPassword, user.password ))){
        return next(new AppError('Your current password is wrong',401))
    }

    // IF so < Update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save().catch(error=> next(error))

    createSendToken(user, 201, res)
})