const express = require("express")
const router = express.Router()


const {getAllNFTs, createNFTs, getSingleNFT, updateNFT, deleteNFT, aliasTopNFTs, getNFTsStats, getMonthlyPlan} = require('./../controllers/nftsControllers')
const { protect, restrictTo } = require("../controllers/authController")

// router.param("id", checkIDs)

// TOP % NFTs BY PRICE
router.route('/top-5-nfts').get(aliasTopNFTs , getAllNFTs)

// Stats Route
router.route('/stats').get(getNFTsStats)

// Get Monthly Plan
router.route('/monthly-plan/:year').get(getMonthlyPlan)

// Router for NFTS
router
    .route('/')
    .get(protect,getAllNFTs)
    .post(createNFTs)
    // .post(checkBody, createNFTs)
// Router for changes
router
    .route('/:id')
    .get(getSingleNFT)
    .patch(updateNFT)
    .delete(protect,restrictTo('admin','guide'),deleteNFT)

module.exports = router;