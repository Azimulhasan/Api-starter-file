// const fs = require("fs");
// const nfts = JSON.parse(fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`))


const catchAsync = require("../Utils/catchAsync")
const AppError = require("../Utils/appError")
const NFT = require("./../models/nftModel")
const APIFeatures = require('./../Utils/apiFeatures')

//GET- ALL TOP NFTs 
exports.aliasTopNFTs = async(req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingAverage,price'
    req.query.fields = "name,price,ratingAverage,difficulty"
    next()
}
// GET NFTs
exports.getAllNFTs = catchAsync(async(req, res, next) => {
    const features = new APIFeatures(NFT.find(), req.query).filter().sort().limitFields().pagination()
        const promisedquery = features.query.exec()

        const nfts = await promisedquery
        res
            .status(200)
            .json({
                status: "success",
                resquestTime: req.requestTime, 
                results: nfts.length, 
                data: {
                    nfts
                }
            })
    }
)

// POST NFT - single
exports.createNFTs = catchAsync(async (req, res, next) => {
  
    const newNFT = await NFT.create(req.body)
    res.status(201).json({
        status:"success",
        data: {
            nft: newNFT
        }
    })
    // try {
    //     const newNFT = await NFT.create(req.body)
    //     res.status(201).json({
    //         status:"success",
    //         data: {
    //             nft: newNFT
    //         }
    //     })

    // } catch (error) {
    //     res.status(400).json({
    //         status:"failed",
    //         message: "Invalid data was sent for NFT"
    //     })
    // }
})
// GET NFT - Single
exports.getSingleNFT = catchAsync(async(req, res, next) => {
    const nft = await NFT.findById(req.params.id).exec()
    
    if(!nft){
        return next(new AppError('No nft Found with that Id', 404))
    }
    
    res
        .status(200)
        .json({
            status: "success",
            resquestTime: req.requestTime,  
            data: {
                nft
            }
        })
})
// Patch Method
exports.updateNFT = catchAsync(async (req, res, next) => {
  

    const nft = await NFT.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators: true,
    })

    if(!nft){
        return next(new AppError('No nft Found with that Id', 404))
    }
    
    res.status(200).json({
        status:"success",
        data:{
            nft
        }
    })


})
// Delete Method
exports.deleteNFT = catchAsync(async(req, res, next) => {
    const nft= await NFT.findByIdAndDelete(req.params.id)
    if(!nft){
        return next(new AppError('No nft Found with that Id', 404))
    }
    
    res
        .status(204)
        .json({
            status: "success",
            data: null
        })
})

// Aggregation Pipeline
exports.getNFTsStats = catchAsync(async(req,res, next) =>{
    const stats =   await NFT.aggregate([
        {
            $match: {ratingsAverage:{$gte: 4.5}}
        },
        {
            $group: {
                _id:"$ratingsAverage",
                num: {$sum: 1},
                numRating: {$sum :"$ratingsQuantity"},
                avgRating: {$avg: "$ratingsAverage"},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'}
            },
        },
        
    ])
    res.status(200).json({
        status:"success",
        data:{
            stats
        }
    })
})

// Calculating the number of NFTs created in a month
exports.getMonthlyPlan = catchAsync(async( req, res, next) =>{
    const year = req.params.year *1;
    const plan  = await NFT.aggregate([
        {
            $unwind:"$startDates"
        },
        {
            $match:{
                startDates:{
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group:{
                _id: {$month: "$startDates"},
                numNFTStarts: {$sum: 1},
                nfts: { $push :"$name"}
            }
        },
        {
            $addFields: {
                month : "$_id",
            }
        },
        {
            $project:{
                _id: 0
            }
        },
        {
            $sort: {numNFTStarts: -1}
        },
        {
            $limit: 12
        }
    ])
    res.status(200).json({
        status:"success",
        data:{
            plan
        }
    })
   
})