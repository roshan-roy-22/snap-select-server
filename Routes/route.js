const express = require('express');
const router = express.Router()
const userController = require('../Controllers/userContollers');
const jwtMiddleware = require('../Middlewares/jwtMiddleware');
const multerConfig = require('../Middlewares/multerMiddleware');


//register
router.post('/register', userController.register)

//login
router.post('/login', userController.login)

//userinfo
router.post('/user-info', jwtMiddleware, userController.userinfo)

//
// router.post('/apply-vendor', jwtMiddleware, multerConfig.single('coverImage'),userController.applyVendor)
router.post('/apply-vendor', jwtMiddleware, multerConfig.fields([{name:"coverImage",maxCount:1},{name:'photos',maxCount:1000}]), userController.applyVendor);

module.exports = router 