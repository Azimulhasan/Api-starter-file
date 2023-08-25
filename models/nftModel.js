const mongoose = require("mongoose")
const slugify = require('slugify')
// const validator = require('validator')


const nftSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, "An NFT must have a name"],
        unique: true,
        trim: true,  
        maxlength: [40, "Nft name should not exceed 40 charectors"],
        minlength: [5, "Nft name must have atleast 5 charectors"],
        // validate: [validator.isAlpha, 'NFT must only contain charectors']
    },
    slug: String,
    duration:{
        type: String,
        required: [true , "Must provide a duration"]
    },
    maxGroupSize:{
        type: Number,
        required: [true, "Must provide a max group size"]
    },
    difficulty: {
        type: String,
        required: [true, "Must have a difficulty"],
        enum: {
            values: ["easy", "medium", "difficult"],
            message: "Difficulty can be either: Easy, Medium, Difficult"
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Must have more than 1"],
        max: [5, "Must have less than or equal to 5"],
    },
    ratingsQuantity:{
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, "An NFT must have a price"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            // This will only work at the time of creating and not updating
            validator: function(val){
                return val < this.price
            },
            message: "Discount price ({VALUE}) should be below regular price"
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "Must Provide a summery"]
    },
    description:{
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, " Must provide the coverImage "]
    },
    images: [String],
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretNFTs: {
        type: Boolean,
        default: false,
    },
},
{
    toJSON : {
        virtuals: true 
    },
    toObject : {
        virtuals: true
    }
})

nftSchema.virtual("durationWeeks").get(function(){
    return this.duration / 7
})

// Mongoose Middleware
//Document Middleware: runs before .save() and .create()
nftSchema.pre("save",function(next){
    //console.log(this)
    this.slug = slugify(this.name, {lower: true})
    next()
})

// Query Middleware

// ------ pre 
// nftSchema.pre("find",function(next){
nftSchema.pre(/^find/,function(next){
    this.find({
        secretNFTs: {
            $ne : true
        }
    })

    
    next()
})

// nftSchema.pre("findOne",function(next){
//     this.find({
//         secretNFTs: {
//             $ne : true
//         }
//     })
//     next()
// })

// -----post
// nftSchema.post(/^find/,function(doc,next){
//     console.log(doc)
//     next()
// })


/// AGGREGATE MiddleWare

// nftSchema.pre("aggregate", function(next){
//     this.pipeline().unshift({
//         $match: {
//             secretNFTs: { $ne : true}
//         }
//     })
//     next()
// })

const NFT = mongoose.model("NFT", nftSchema)

module.exports = NFT