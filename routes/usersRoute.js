const express = require('express')

const router = express.Router()
const usersControllers = require('./../controllers/usersControllers')
const authController = require('../controllers/authController')

// Router for Signup
router.post('/signup', authController.signup)
router.post('/login', authController.login)

// Router for Password update
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

router.patch('/updatePassword', authController.protect,authController.updatePassword)

router.patch('/updateMe', authController.protect,usersControllers.updateMe)

router.delete('/deleteMe', authController.protect,usersControllers.deleteMe)

// ROuter for Users
router
    .route('/')
    .get(usersControllers.getAllUsers)
    .post(usersControllers.createUser);
router
    .route('/:id')
    .get(usersControllers.getSingleUser)
    .patch(usersControllers.updateUser)
    .delete(usersControllers.deleteUser);

module.exports = router;