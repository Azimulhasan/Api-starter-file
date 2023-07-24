// const fs = require("fs");
// const nfts = JSON.parse(fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`))

const NFT = require("./../models/nftModel")



// exports.checkIDs = (req, res, next , value) =>{
//     console.log("ID:",value)
//     const id = req.params.id * 1;
//     // if (id >= nfts.length) {
//     //     return res
//     //         .status(404)
//     //         .json({
//     //             status: "failed", 
//     //             message: "Invalid ID"
//     //         })
//     // }
//     next()
// }

// exports.checkBody = (req, res, next) =>{
//     if(!req.body.name || !req.body.price){
//         return res.status(400).json({
//             status: "failed",
//             message: "Missing name and price"
//         })
//     }
//     next()
// }

// GET NFTs
exports.getAllNFTs = async(req, res) => {
    try {

        // catching quary data
        const queryObj = { ...req.query}
        // excluding some fields
        const excludedFlelds = ["page","limit","fields","sort"]
        excludedFlelds.forEach((el)=> delete queryObj[el])
        
        // Adding to $ to [gte/gt/lte/lt]
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

        // query is loaded
        let query = NFT.find(JSON.parse(queryStr))

        // Sorting method
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
  
        }else{
            query = query.sort("-createdAt")
        }

        //Field Limiting
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ')+' -__v'
            query = query.select(fields)
        }else{
            query = query.select('-__v')
        }

        //Pagination Functions
        const page = req.query.page * 1 || 1; // defaults as 1 if page was not provided
        const limit = req.query.limit * 1 || 10
        const skip = (page - 1) * limit 

        query = query.skip(skip).limit(limit)


        const promisedquery = query.exec()

        const nfts = await promisedquery
        console.log(nfts)
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