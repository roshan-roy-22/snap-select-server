const express = require('express');
const router = express.Router()
const userController = require('../Controllers/userContollers');
const jwtMiddleware = require('../Middlewares/jwtMiddleware');
const multerConfig = require('../Middlewares/multerMiddleware');
const adminController = require('../Controllers/adminController')

//register
router.post('/register', userController.register)

//login
router.post('/login', userController.login)

//userinfo
router.post('/user-info', jwtMiddleware, userController.userinfo)

//apply vendor
router.post('/apply-vendor', jwtMiddleware, multerConfig.fields([{name:"coverImage",maxCount:1},{name:'photos',maxCount:1000}]), userController.applyVendor);

//set seen notification
router.post('/setseen-notification',jwtMiddleware,userController.notificationSeen)

//delete notification
router.post('/delete-notification',jwtMiddleware,userController.deleteNotifation)

//get all users
router.get('/alluser',jwtMiddleware,adminController.getallUser)

//get all photographers
router.get('/all-photographers',jwtMiddleware,adminController.getallPhotographers)

//change acc type

router.post('/change-acc-status',jwtMiddleware,adminController.changeAccountStatus)

router.get('/getallvendors',jwtMiddleware,userController.getallVendors)

module.exports = router 