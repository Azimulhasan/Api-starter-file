const express = require("express")
const router = express.Router()

const {getAllNFTs, createNFTs, getSingleNFT, updateNFT, deleteNFT, checkIDs, checkBody} = require('./../controllers/nftsControllers')

router.param("id", checkIDs)

// Router for NFTS
router
    .route('/')
    .get(getAllNFTs)
    .post(checkBody, createNFTs)
// Router for changes
router
    .route('/:id')
    .get(getSingleNFT)
    .patch(updateNFT)
    .delete(deleteNFT)

module.exports = router;