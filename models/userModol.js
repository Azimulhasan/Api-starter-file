const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please Tell us your name']
    },
    email:{
        type: String,
        required: [true, "Please provide your email" ],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid Email Address"]
    },
    // photo:{
    //     type: String,
    // }
    photo: String,
    password:{
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            //This is only work on save and not on findone or find - work for only first time
            validator: function(el){
                return el == this.password // true for success and false with stop it
            },
            message: "Password does not match"
        }
    },
    passwordChangedAt: Date,
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    
    //Rub this code
    //Hash password 12
    this.password = await bcrypt.hash(this.password, 12)

    //Delete confirm password
    this.passwordConfirm = undefined
    next()
})


userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}
userSchema.methods.changePasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000 , 10 ) 
        console.log(changedTimeStamp, JWTTimestamp)
    }
    return false
}

const User = mongoose.model("User", userSchema)

module.exports = User