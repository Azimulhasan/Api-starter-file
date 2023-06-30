const fs = require("fs");
const nfts = JSON.parse(fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`))

exports.checkIDs = (req, res, next , value) =>{
    console.log("ID:",value)
    const id = req.params.id * 1;
    if (id >= nfts.length) {
        return res
            .status(404)
            .json({
                status: "failed", 
                message: "Invalid ID"
            })
    }
    next()
}

exports.checkBody = (req, res, next) =>{
    if(!req.body.name || !req.body.price){
        return res.status(400).json({
            status: "failed",
            message: "Missing name and price"
        })
    }
    next()
}

// GET NFTs
exports.getAllNFTs = (req, res) => {
    res
        .status(200)
        .json({
            status: "success", resquestTime: req.requestTime, results: nfts.length, data: {
                nfts
            }
        })
}
// POST NFT - single
exports.createNFTs = (req, res) => {
    const newId = nfts[nfts.length - 1].id + 1;
    const newNFTs = Object.assign({
        id: newId
    }, req.body)
    nfts.push(newNFTs)
    fs.writeFile(`${__dirname}/nft-data/data/nft-simple.json`, JSON.stringify(nfts), (err) => {
        res
            .status(201)
            .json({
                status: "success", 
                nfts: newNFTs
            })
    })
}
// GET NFT - Single
exports.getSingleNFT = (req, res) => {
    const id = req.params.id * 1;
    const nft = nfts.find((el) => (el['id'] === id))
    res
        .status(200)
        .json({
            status: "success", 
            data: {
                nft
            }
        })
}
// Patch Method
exports.updateNFT = (req, res) => {
    res
        .status(200)
        .json({
            status: "success",
            data: {
                nft: "Updating NFTs"
            }
        })
}
// Delete Method
exports.deleteNFT = (req, res) => {

    res
        .status(204)
        .json({
            status: "success", 
            data: null
        })
}