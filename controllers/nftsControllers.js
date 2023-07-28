// const fs = require("fs");
// const nfts = JSON.parse(fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`))

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
exports.getAllNFTs = async(req, res) => {
    try {

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
    } catch (error) {
        res.status(404).json({
            status:"failed",
            message:error
        })
    }
    
    
}
// POST NFT - single
exports.createNFTs = async (req, res) => {
  
    try {
        const newNFT = await NFT.create(req.body)
        res.status(201).json({
            status:"success",
            data: {
                nft: newNFT
            }
        })

    } catch (error) {
        res.status(400).json({
            status:"failed",
            message: "Invalid data was sent for NFT"
        })
    }
}
// GET NFT - Single
exports.getSingleNFT = async(req, res) => {
    try {

        const nft = await NFT.findById(req.params.id)
        res
            .status(200)
            .json({
                status: "success",
                resquestTime: req.requestTime,  
                data: {
                    nft
                }
            })
    } catch (error) {
        res.status(404).json({
            status:"failed",
            message: error
        })
    }
}
// Patch Method
exports.updateNFT = async (req, res) => {
   try {

        const nft = await NFT.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators: true
        })
        res.status(200).json({
            status:"success",
            data:{
                nft
            }
        })

   } catch (error) {
        res.status(404).json({
            status:"failed",
            message: error
        })
   }
}
// Delete Method
exports.deleteNFT = async(req, res) => {

    try {

        await NFT.findByIdAndDelete(req.params.id)
        res
            .status(204)
            .json({
                status: "success",
                data: null
            })
    } catch (error) {
        res.status(404).json({
            status:"failed",
            message: error
        })
    }
}

// Aggregation Pipeline
exports.getNFTsStats = async(req,res) =>{
    try {
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
    } catch (error) {
        res.status(404).json({
            status:'failed',
            message: error
        })
    }
}

// Calculating the number of NFTs created in a month
exports.getMonthlyPlan = async( req, res) =>{
    try {
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
    } catch (error) {
        res.status(404).json({
            status:'failed',
            message: error
        })
    }
}