// const fs = require("fs");
// const nfts = JSON.parse(fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`))

const NFT = require("./../models/nftModel")



exports.checkIDs = (req, res, next , value) =>{
    console.log("ID:",value)
    const id = req.params.id * 1;
    // if (id >= nfts.length) {
    //     return res
    //         .status(404)
    //         .json({
    //             status: "failed", 
    //             message: "Invalid ID"
    //         })
    // }
    next()
}

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

        const nfts = await NFT.find()
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