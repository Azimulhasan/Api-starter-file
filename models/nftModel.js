const mongoose = require("mongoose")
const slugify = require('slugify')


const nftSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, "An NFT must have a name"],
        unique: true,
        trim: true,  
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
        required: [true, "Must have a difficulty"]
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity:{
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, "An NFT must have a price"]
    },
    priceDiscount: Number,
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

const NFT = mongoose.model("NFT", nftSchema)

module.exports = NFT