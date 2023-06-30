const express = require('express')

const router = express.Router()
const usersControllers = require('./../controllers/usersControllers')

// ROuter for Users
router
    .route('/')
    .get(usersControllers.getAllUsers)
    .post(usersControllers.createUser);
router
    .route('/:id')
    .get(usersControllers.getSingleUser)
    .patch(usersControllers.updataUser)
    .delete(usersControllers.deleteUser)

module.exports = router;